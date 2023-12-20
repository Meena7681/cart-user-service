export interface CartItemModel{
    product_id: string;
    name:string;
    image_url:string;
    price:number;
    item_qty:number;
    item_id?:number;
    cart_id?:number;
}