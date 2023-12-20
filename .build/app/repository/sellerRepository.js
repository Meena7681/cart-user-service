"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SellerRepository = void 0;
const dbOperation_1 = require("./dbOperation");
class SellerRepository extends dbOperation_1.DBOperation {
    constructor() {
        super();
    }
    checkEnrolledProgram(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT user_type from users WHERE user_id=$1 AND user_type=$2";
            const result = yield this.executeQuery(queryString, [userId, "SELLER"]);
            if (result.rowCount > 0) {
                return true;
            }
            else {
                return false;
            }
        });
    }
    updateProfile(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "UPDATE users SET first_name=$1, last_name=$2,phone=$3,user_type=$4 WHERE user_id=$5 RETURNING *";
            const values = [
                input.firstName,
                input.lastName,
                input.phoneNumber,
                "SELLER",
                input.user_id,
            ];
            const result = yield this.executeQuery(queryString, values);
            if (result.rowCount > 0) {
                return result.rows[0];
            }
            else {
                return false;
            }
        });
    }
    updateAddress(input) {
        return __awaiter(this, void 0, void 0, function* () {
            const addressQuery = "SELECT * FROM address WHERE user_id=$1";
            const addressResult = yield this.executeQuery(addressQuery, [
                input.user_id,
            ]);
            let queryString = `INSERT INTO address(
        address_line1,
        address_line2,
        city,
        post_code,
        country,
        user_id,
      ) VALUES ($1,$2,$3,$4,$5,$6)`;
            const values = [
                input.addressLine1,
                input.addressLine2,
                input.city,
                input.postCode,
                input.country,
                input.user_id,
            ];
            if (addressResult.rowCount > 0) {
                queryString = `UPDATE address SET 
      address_line1=$1,
      address_line2=$2,
      city=$3,
      post_code=$4,
      country=$5 
      WHERE user_id=$6`;
            }
            return this.executeQuery(queryString, values);
        });
    }
    createPaymentMethod({ bankAccountNumber, swiftCode, paymentType, user_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `INSERT INTO payment_method(
      bank_account_number,
      swift_code,
      payment_type,
      user_id) VALUES($1,$2,$3,$4)`;
            const values = [Number(bankAccountNumber), swiftCode, paymentType, user_id];
            const result = yield this.executeQuery(queryString, values);
            return result.rowCount > 0;
        });
    }
    getPaymentMethods(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = "SELECT * from payment_methods WHERE user_id=$1";
            const result = yield this.executeQuery(queryString, [userId]);
            if (result.rowCount < 0) {
                throw new Error("payment methods does not exists!");
            }
            return result.rows[0];
        });
    }
    updatePaymentMethod({ bankAccountNumber, swiftCode, paymentType, payment_id, user_id, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryString = `UPDATE payment_methods
    SET
        bank_account=$1,
        swift_code=$2,
        payment_type=$3
    WHERE 
        id=$4
    AND
        user_id=$5
    `;
            const values = [
                Number(bankAccountNumber),
                swiftCode,
                paymentType,
                payment_id,
                user_id,
            ];
            return this.executeQuery(queryString, values);
        });
    }
}
exports.SellerRepository = SellerRepository;
//# sourceMappingURL=sellerRepository.js.map