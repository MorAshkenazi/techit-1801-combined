import axios from "axios";

const api: string = `${process.env.REACT_APP_API}/carts`;

export function getProductsFromCart() {
  return axios.get(api, {
    headers: {
      Authorization: JSON.parse(localStorage.getItem("token") as string),
    },
  });
}

export function addToCart(productId: string) {
  return axios.patch(
    api,
    { productId },
    {
      headers: {
        Authorization: JSON.parse(localStorage.getItem("token") as string),
      },
    }
  );
}
