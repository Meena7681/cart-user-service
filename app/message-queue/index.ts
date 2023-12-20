import axios from "axios";
//  after deployed product service that url is come and replace this url that url
const PRODUCT_SERVICE_URL = "https://url-1.amazonaws.com/prod/products-queue"; //"http://127.0.0.1:3000/product-queue"; // itme will be come  prom process.env

export const PullData = async (requestData: Record<string, unknown>) => {
  return axios.post(PRODUCT_SERVICE_URL, requestData);
};
