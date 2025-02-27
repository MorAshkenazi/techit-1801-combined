import { FunctionComponent, useEffect, useState } from "react";
import { Product } from "../interfaces/Product";
import { getProductsFromCart } from "../services/cartsService";
import Navbar from "./Navbar";

interface CartProps {}

const Cart: FunctionComponent<CartProps> = () => {
  let [products, setProducts] = useState<any>([]);
  useEffect(() => {
    getProductsFromCart()
      .then((res: any) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <Navbar />
      <div className="row mt-3">
        {products.length ? (
          products.map((product: Product) => (
            <div
              key={product._id}
              className="card col-md-4"
              style={{ width: "18rem" }}
            >
              <div className="card-header">{product.category}</div>
              <img
                src={product.image}
                className="card-img-top"
                alt={product.name}
                title={product.name}
              />
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text text-success">{product.price}$</p>
                <p className="card-text text-primary">
                  quantity: {product.quantity}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p>No products </p>
        )}
      </div>
    </>
  );
};

export default Cart;
