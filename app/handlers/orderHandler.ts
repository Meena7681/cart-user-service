import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CartRepository } from "../repository/cartRepository";
import { CartService } from "../service/cartService";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";

const cartService = new CartService(new CartRepository());

export const CollectPayment = middy((event: APIGatewayProxyEventV2) => {
  return cartService.CollectPayment(event);
}).use(bodyParser());

export const PlaceOrder = middy((event: APIGatewayProxyEventV2) => {
  return cartService.placeOrder(event);
}).use(bodyParser());
