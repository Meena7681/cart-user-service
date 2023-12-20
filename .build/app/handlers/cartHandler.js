"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetCart = exports.EditCart = exports.DeleteCart = exports.CreateCart = void 0;
const cartRepository_1 = require("../repository/cartRepository");
const cartService_1 = require("../service/cartService");
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const service = new cartService_1.CartService(new cartRepository_1.CartRepository());
exports.CreateCart = (0, core_1.default)((event) => {
    return service.CreateCart(event);
}).use((0, http_json_body_parser_1.default)());
exports.DeleteCart = (0, core_1.default)((event) => {
    return service.DeleteCart(event);
}).use((0, http_json_body_parser_1.default)());
exports.EditCart = (0, core_1.default)((event) => {
    return service.UpdateCart(event);
}).use((0, http_json_body_parser_1.default)());
exports.GetCart = (0, core_1.default)((event) => {
    return service.GetCart(event);
}).use((0, http_json_body_parser_1.default)());
//# sourceMappingURL=cartHandler.js.map