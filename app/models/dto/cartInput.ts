import { IsNumber, Length } from "class-validator";

export class CartInput {
  @IsNumber()
  qty: number;
  @Length(6, 24)
  productId: string;
}

export class UpdateCartInput {
  @IsNumber()
  qty: number;
}
