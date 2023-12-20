export interface CreatePaymentSessionInput {
  phone: string;
  email: string;
  amount: number;
  customerId?: string;
}
