import { container } from "tsyringe";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserService } from "../service/userService";
import { ErrorResponse } from "../utility/response";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";

const service = container.resolve(UserService);

export const Signup = middy((event: APIGatewayProxyEventV2) => {
  // post
  return service.CreateUser(event);
}).use(bodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  // post
  return service.UserLogin(event);
}).use(bodyParser());

export const Verify = middy((event: APIGatewayProxyEventV2) => {
  // post
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.VerifyUser(event);
  } else if (httpMethod === "get") {
    return service.GetVerificationToken(event);
  } else {
    return service.ResponseWithError(event);
  }
}).use(bodyParser());

export const Profile = middy((event: APIGatewayProxyEventV2) => {
  // post put get
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreateProfile(event);
  } else if (httpMethod === "put") {
    return service.EditProfile(event);
  } else if (httpMethod === "get") {
    return service.GetProfile(event);
  } else {
    return service.ResponseWithError(event);
  }
}).use(bodyParser());

export const Cart = middy((event: APIGatewayProxyEventV2) => {
  // post put get
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreateCart(event);
  } else if (httpMethod === "put") {
    return service.UpdateCart(event);
  } else if (httpMethod === "get") {
    return service.GetCart(event);
  } else {
    return service.ResponseWithError(event);
  }
}).use(bodyParser());

export const Payment = async (event: APIGatewayProxyEventV2) => {
  // post put get
  const httpMethod = event.requestContext.http.method.toLowerCase();
  if (httpMethod === "post") {
    return service.CreatePaymentMethod(event);
  } else if (httpMethod === "put") {
    return service.UpdatePaymentMethod(event);
  } else if (httpMethod === "get") {
    return service.GetPaymentMethod(event);
  } else {
    return ErrorResponse(404, "Requested method is not supported!");
  }
};
