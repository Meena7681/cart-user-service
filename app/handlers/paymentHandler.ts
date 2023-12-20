import { APIGatewayProxyEventV2 } from "aws-lambda";
import middy from "@middy/core";
import bodyParser from "@middy/http-json-body-parser";
import { CartRepository } from "../repository/cartRepository";
import { CartService } from "../service/cartService";

const service = new CartService(new CartRepository());
export const Payment = middy((event: APIGatewayProxyEventV2) => {}).use(
  bodyParser()
);
