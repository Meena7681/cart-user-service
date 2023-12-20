"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaceOrder = exports.CollectPayment = void 0;
const cartRepository_1 = require("../repository/cartRepository");
const cartService_1 = require("../service/cartService");
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const cartService = new cartService_1.CartService(new cartRepository_1.CartRepository());
exports.CollectPayment = (0, core_1.default)((event) => {
    return cartService.CollectPayment(event);
}).use((0, http_json_body_parser_1.default)());
exports.PlaceOrder = (0, core_1.default)((event) => {
    return cartService.placeOrder(event);
}).use((0, http_json_body_parser_1.default)());
//# sourceMappingURL=orderHandler.js.map