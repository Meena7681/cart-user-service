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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RetrivePayment = exports.CreatePaymentSession = exports.STRIPE_FEE = exports.APPLICATION_FEE = exports.STRIPE_PUBLISHABLE_KEY = exports.STRIPE_SECRET_KEY = void 0;
const stripe_1 = __importDefault(require("stripe"));
exports.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
exports.STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY;
const APPLICATION_FEE = (totalAmount) => {
    const appFee = 1.5; // application fee in %
    return (totalAmount / 100) * appFee;
};
exports.APPLICATION_FEE = APPLICATION_FEE;
const STRIPE_FEE = (totalAmount) => {
    const perTransaction = 2.9; // 2.9 % per Transaction
    const fixCost = 0.29; // 29 cent
    const stripeCost = (totalAmount / 100) * perTransaction;
    return stripeCost + fixCost;
};
exports.STRIPE_FEE = STRIPE_FEE;
const stripe = new stripe_1.default(exports.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16",
});
const CreatePaymentSession = ({ email, phone, amount, customerId, }) => __awaiter(void 0, void 0, void 0, function* () {
    let currentCustomerId;
    if (customerId) {
        const customer = yield stripe.customers.retrieve(customerId);
        currentCustomerId = customer.id;
    }
    else {
        const customer = yield stripe.customers.create({
            email,
        });
        currentCustomerId = customer.id;
    }
    const { client_secret, id } = yield stripe.paymentIntents.create({
        customer: currentCustomerId,
        payment_method_types: ["card"],
        amount: parseInt(`${amount * 100}`),
        currency: "usd",
    });
    return {
        secret: client_secret,
        publishableKey: exports.STRIPE_PUBLISHABLE_KEY,
        paymentId: id,
        customerId: currentCustomerId,
    };
});
exports.CreatePaymentSession = CreatePaymentSession;
const RetrivePayment = (paymentId) => __awaiter(void 0, void 0, void 0, function* () {
    return stripe.paymentIntents.retrieve(paymentId);
});
exports.RetrivePayment = RetrivePayment;
//# sourceMappingURL=payment.js.map