import { APIGatewayProxyEventV2 } from "aws-lambda";
import { CartRepository } from "../repository/cartRepository";
import { CartService } from "../service/cartService";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";

const service = new CartService(new CartRepository());

export const CreateCart = middy((event: APIGatewayProxyEventV2) => {
  return service.CreateCart(event);
}).use(bodyParser());

export const DeleteCart = middy((event: APIGatewayProxyEventV2) => {
  return service.DeleteCart(event);
}).use(bodyParser());

export const EditCart = middy((event: APIGatewayProxyEventV2) => {
  return service.UpdateCart(event);
}).use(bodyParser());

export const GetCart = middy((event: APIGatewayProxyEventV2) => {
  return service.GetCart(event);
}).use(bodyParser());
