// user service which is handlle data access layer
import { DBClient } from "../utility/databaseClient";
import { UserModel } from "../models/UserModel";
import { DBOperation } from "./dbOperation";
import { ProfileInput } from "../models/dto/AddressInput";
import { AddressModel } from "../models/AddressModel";
import { ShoppingCartModel } from "../models/ShoppingCartModel";
import { CartItemModel } from "../models/CartItemsModel";
export class CartRepository extends DBOperation {
  constructor() {
    super();
  }
  async findShoppingCart(userId: string) {
    const queryString =
      "SELECT cart_id, user_id FROM shopping_carts WHERE user_id=$1";
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    return result.rowCount > 0 ? (result.rows[0] as ShoppingCartModel) : false;
  }
  async createShoppingCart(userId: string) {
    const queryString =
      "INSERT INTO shopping_carts(user_id) VALUES($1) RETURNING *";
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    return result.rowCount > 0 ? (result.rows[0] as ShoppingCartModel) : false;
  }
  async findCartItemById(cartId: string) {}

  async findCartItemByProductId(productId: string) {
    const queryString =
      "SELECT product_id,price,item_qty FROM cart_items WHERE product_id =$1";
    const values = [productId];
    const result = await this.executeQuery(queryString, values);
    return result.rowCount > 0 ? (result.rows[0] as CartItemModel) : false;
  }
  async findCartItems(userId: string) {
    const queryString = `SELECT
     ci.card_id,
     ci.item_id,
     ci.product_id,
     ci.name,
     ci.price,
     ci.item_qty,
     ci.image_url,
     ci.created_at FROM shopping_carts sc INNER JOIN cart_items ci ON sc.cart_id=ci.cart_id WHERE sc.user_id=$1`;
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    return result.rowCount > 0 ? (result.rows as CartItemModel[]) : [];
  }
  async findCartItemsByCartId(userId: number) {
    const queryString =
      "SELECT product_id,name , image_url,price,item_qty FROM cart_items WHERE cart_id = $1";
    const values = [userId];
    const result = await this.executeQuery(queryString, values);
    return result.rowCount > 0 ? (result.rows as CartItemModel[]) : [];
  }
  async createCartItem({
    cart_id,
    product_id,
    name,
    image_url,
    price,
    item_qty,
  }: CartItemModel) {
    const queryString =
      "INSERT INTO cart_items(cart_id,product_id,name,image_url,price,item_qty) VALUES($1,$2,$3,$4,$5,$6)  RETURNING *";
    const values = [cart_id, product_id, name, image_url, price, item_qty];
    const result = await this.executeQuery(queryString, values);
    return result.rowCount > 0 ? (result.rows[0] as CartItemModel) : false;
  }
  async updateCartItemById(itemId: number, qty: number) {
       const queryString = 
        "UPDATE cart_items SET item_ qty=$1 WHERE item_id=$2 RETURNING *";
       const values =[qty , itemId];
       const result = await this.executeQuery(queryString,values);
       return result.rowCount > 0 ? (result.rows[0] as CartItemModel) : false;
  }
  async updateCartItemByProductId(productId: string, qty: number) {
    const queryString =
      "UPDATE cart_items SET item_qty=$1 WHERE product_id=$2 RETURNING *";
    const values = [qty, productId];
    const result = await this.executeQuery(queryString, values);
    return result.rowCount > 0 ? (result.rows[0] as CartItemModel) : false;
  }
  async deleteCartItem(id: number) {
    const queryString = "DELETE FROM cart_items WHERE item_id=$1";
    const values = [id];
    return this.executeQuery(queryString,values);
  }
}
