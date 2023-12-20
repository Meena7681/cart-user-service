import { AddressModel } from "./AddressModel";

export interface UserModel {
  user_id?: string;
  email: string;
  password: string;
  salt: string;
  phone: string;
  userType: "BUYER" | "SELLER";
  first_name?: string;
  last_name?: string;
  profile_pic?: string;
  verification_code?: number;
  expiry?: string;
  address?: AddressModel[];
  stripe_id?: string;
  payment_id?: string;
}
