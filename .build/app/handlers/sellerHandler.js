"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EditPaymentMethods = exports.GetPaymentMethods = exports.JoinSellerProgram = void 0;
const core_1 = __importDefault(require("@middy/core"));
const http_json_body_parser_1 = __importDefault(require("@middy/http-json-body-parser"));
const sellerService_1 = require("../service/sellerService");
const sellerRepository_1 = require("../repository/sellerRepository");
const service = new sellerService_1.SellerService(new sellerRepository_1.SellerRepository());
exports.JoinSellerProgram = (0, core_1.default)((event) => {
    return service.JoinSellerProgram(event);
}).use((0, http_json_body_parser_1.default)());
exports.GetPaymentMethods = (0, core_1.default)((event) => {
    return service.GetPaymentMethods(event);
}).use((0, http_json_body_parser_1.default)());
exports.EditPaymentMethods = (0, core_1.default)((event) => {
    return service.EditPaymentMethods(event);
}).use((0, http_json_body_parser_1.default)());
//# sourceMappingURL=sellerHandler.js.map