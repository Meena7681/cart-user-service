import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { SellerService } from "../service/sellerService";
import { SellerRepository } from "../repository/sellerRepository";

const service = new SellerService(new SellerRepository());

export const JoinSellerProgram = middy((event: APIGatewayProxyEventV2) => {
  return service.JoinSellerProgram(event);
}).use(bodyParser());

export const GetPaymentMethods = middy((event: APIGatewayProxyEventV2) => {
  return service.GetPaymentMethods(event);
}).use(bodyParser());

export const EditPaymentMethods = middy((event: APIGatewayProxyEventV2) => {
  return service.EditPaymentMethods(event);
}).use(bodyParser());
