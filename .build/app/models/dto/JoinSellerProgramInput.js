"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerProgramInput = exports.PaymentMethodInput = void 0;
const class_validator_1 = require("class-validator");
class PaymentMethodInput {
}
exports.PaymentMethodInput = PaymentMethodInput;
__decorate([
    (0, class_validator_1.Length)(4, 24),
    __metadata("design:type", String)
], PaymentMethodInput.prototype, "bankAccountNumber", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12),
    __metadata("design:type", String)
], PaymentMethodInput.prototype, "swiftCode", void 0);
__decorate([
    (0, class_validator_1.Length)(6, 12),
    __metadata("design:type", String)
], PaymentMethodInput.prototype, "paymentType", void 0);
class SellerProgramInput extends PaymentMethodInput {
}
exports.SellerProgramInput = SellerProgramInput;
__decorate([
    (0, class_validator_1.Length)(3, 16),
    __metadata("design:type", String)
], SellerProgramInput.prototype, "firstName", void 0);
__decorate([
    (0, class_validator_1.Length)(3, 16),
    __metadata("design:type", String)
], SellerProgramInput.prototype, "lastName", void 0);
__decorate([
    (0, class_validator_1.Length)(8, 12),
    __metadata("design:type", String)
], SellerProgramInput.prototype, "phoneNumber", void 0);
//# sourceMappingURL=JoinSellerProgramInput.js.map