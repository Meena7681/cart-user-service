import { APIGatewayProxyEventV2 } from "aws-lambda";
import { UserRepository } from "../repository/userRepository";
import { UserService } from "../service/userService";
import { ErrorResponse } from "../utility/response";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";

const service = new UserService(new UserRepository());
export const Signup = middy((event: APIGatewayProxyEventV2) => {
  return service.CreateUser(event);
}).use(bodyParser());

export const Login = middy((event: APIGatewayProxyEventV2) => {
  return service.UserLogin(event);
}).use(bodyParser());

export const GetVerificationToken = middy((event: APIGatewayProxyEventV2) => {
  return service.GetVerificationToken(event);
}).use(bodyParser());

export const Verify = middy((event: APIGatewayProxyEventV2) => {
  const httpMethod = event.requestContext.http.method.toLowerCase();
  return service.VerifyUser(event);
}).use(bodyParser());

export const CreateProfile = middy((event: APIGatewayProxyEventV2) => {
  return service.CreateProfile(event);
}).use(bodyParser());

export const EditProfile = middy((event: APIGatewayProxyEventV2) => {
  return service.EditProfile(event);
}).use(bodyParser());

export const GetProfile = middy((event: APIGatewayProxyEventV2) => {
  return service.GetProfile(event);
}).use(bodyParser());
