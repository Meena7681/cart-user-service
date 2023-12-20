// user service which is handle bussiness loggic

import { plainToClass } from "class-transformer";
import { UserRepository } from "../repository/userRepository";
import { ErrorResponse, SuccessResponse } from "../utility/response";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { autoInjectable } from "tsyringe";
import { SignupInput } from "../models/dto/SignupInput";
import { AppValidationError } from "../utility/errors";
import {
  GetSalt,
  GetHashedPassword,
  ValidatePassword,
  GetToken,
  VerifyToken,
} from "../utility/password";
import { LoginInput } from "../models/dto/LoginInput";
import {
  GenerateAccessCode,
  SendVerificationCode,
} from "../utility/notification";
import { VerificationInput } from "../models/dto/UpdateInput";
import { TimeDifference } from "../utility/dateHelper";
import { ProfileInput } from "../models/dto/AddressInput";
import { CartRepository } from "../repository/cartRepository";
import { CartInput, UpdateCartInput } from "../models/dto/cartInput";
import jsonBodyParser from "@middy/http-json-body-parser";
import { CartItemModel } from "../models/CartItemsModel";
import { PullData } from "../message-queue";
import aws from "aws-sdk";
import {
  APPLICATION_FEE,
  CreatePaymentSession,
  RetrivePayment,
  STRIPE_FEE,
} from "../utility/payment";

@autoInjectable()
export class CartService {
  repository: CartRepository;
  constructor(repository: CartRepository) {
    this.repository = repository;
  }

  async ResponseWithError(event: APIGatewayProxyEventV2) {
    return ErrorResponse(404, "requested method is not supported!");
  }

  // Cart section
  async CreateCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const input = plainToClass(CartInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      let currentCart = await this.repository.findShoppingCart(payload.user_id);
      if (!currentCart)
        currentCart = await this.repository.createShoppingCart(payload.user_id);

      if (!currentCart) {
        return ErrorResponse(500, "create cart is failed!");
      }

      // find the item if exist
      let currentProduct = await this.repository.findCartItemByProductId(
        input.productId
      );

      if (currentProduct) {
        // if exist update the qty
        await this.repository.updateCartItemByProductId(
          input.productId,
          (currentProduct.item_qty += input.qty)
        );
      } else {
        // if does not call Product service to get product information
        const { data, status } = await PullData({
          action: "PULL_PRODUCT_DATA",
          productId: input.productId,
        });

        // console.log("Getting Product",data);
        if (status !== 200) {
          return ErrorResponse(500, "failed to add to cart!");
        }

        let cartItem = data.data as CartItemModel;
        cartItem.cart_id = currentCart.cart_id;
        cartItem.item_qty = input.qty;
        // Finally create cart item
        await this.repository.createCartItem(cartItem);
      }
      // return all cart items to client
      const cartItems = await this.repository.findCartItemsByCartId(
        currentCart.cart_id
      );
      return SuccessResponse(cartItems);
    } catch (error) {
      //console.log(error);
      return ErrorResponse(500, error);
    }
  }
  async GetCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(403, "authorization failed!");
      const cartItems = await this.repository.findCartItems(payload.user_id);
      const totalAmount = cartItems.reduce(
        (sum, item) => sum + item.price * item.item_qty,
        0
      );
      const appFee = APPLICATION_FEE(totalAmount) + STRIPE_FEE(totalAmount);
      return SuccessResponse({ cartItems, totalAmount, appFee });
    } catch (error) {
      // console.log(error);
      return ErrorResponse(500, error);
    }
  }
  async UpdateCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      const cartItemId = Number(event.pathParameters.id);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const input = plainToClass(UpdateCartInput, event.body);
      const error = await AppValidationError(input);
      if (error) return ErrorResponse(404, error);

      const cartItem = await this.repository.updateCartItemById(
        cartItemId,
        input.qty
      );
      if (cartItem) {
        return SuccessResponse(cartItem);
      }

      return ErrorResponse(404, "item does not exist");
    } catch (error) {
      //console.log(error);
      return ErrorResponse(500, error);
    }
  }
  async DeleteCart(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authorization;
      const payload = await VerifyToken(token);
      const cartItemId = Number(event.pathParameters.id);
      if (!payload) return ErrorResponse(403, "authorization failed!");

      const deletedItem = await this.repository.deleteCartItem(cartItemId);
      return SuccessResponse(deletedItem);
    } catch (error) {
      //console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async CollectPayment(event: APIGatewayProxyEventV2) {
    try {
      const token = event.headers.authenticate;
      const payload = await VerifyToken(token);
      if (!payload) return ErrorResponse(404, "authorization failed!");

      const { stripe_id, email, phone } =
        await new UserRepository().getUserProfile(payload.user_id);
      const cartItems = await this.repository.findCartItems(payload.user_id);
      const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.item_qty,
        0
      );

      const appFee = APPLICATION_FEE(total);
      const stripeFee = STRIPE_FEE(total);
      const amount = 10 + appFee + stripeFee;

      // initialize payment gateway
      const { secret, publishableKey, customerId, paymentId } =
        await CreatePaymentSession({
          amount,
          email,
          phone,
          customerId: stripe_id,
        });

      await new UserRepository().updateUserPayment({
        userId: payload.user_id,
        customerId,
        paymentId,
      });
      //authenticate payment confirmation
      return SuccessResponse({ secret, publishableKey });
    } catch (error) {
      // console.log(error);
      return ErrorResponse(500, error);
    }
  }

  async placeOrder(event: APIGatewayProxyEventV2) {
    const token = event.headers.authenticate;
    const payload = await VerifyToken(token);
    //get cart items
    if (!payload) return ErrorResponse(404, "authorization failed!");

    const { payment_id } = await new UserRepository().getUserProfile(
      payload.user_id
    );
    const paymentInfo = await RetrivePayment(payment_id);

    if (paymentInfo.status === "succeeded") {
      const cartItems = await this.repository.findCartItems(payload.user_id);
      // Send SNS topic to create Order [Transaction MS] => email to user
      const params = {
        Message: JSON.stringify(cartItems),
        TopicArn: process.env.SNS_TOPIC,
        MessageAttributes: {
          actionType: {
            DataType: "String",
            StringValue: "place_order",
          },
        },
      };
      const sns = new aws.SNS();
      const response = await sns.publish(params).promise();
      console.log(response);
      return SuccessResponse({ msg: "success...", paymentInfo });
    }
    // Send Tentative message to user
    return ErrorResponse(503, Error("payment failed!"));
  }
}
