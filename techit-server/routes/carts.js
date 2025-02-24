const express = require("express");
const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require("../middlewares/auth");
const router = express.Router();

router.patch("/", auth, async (req, res) => {
  try {
    // שומרים ids
    // של מוצרים במערך
    // צריך לבדוק quantity
    // [{productId, quantity}]
    // body contains only productId (in object)

    // check if productId is valid
    let product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).send("No such product");

    if (product.quantity) {
      // get user cart
      const cart = await Cart.findOne({
        userId: req.payload._id,
        active: true,
      });
      if (!cart) return res.status(400).send("No active cart");

      // check if product already exists in user cart
      let productToAddIndex = cart.products.findIndex(
        (p) => p.productId == req.body.productId
      );
      // product does not exists in cart
      if (productToAddIndex == -1) {
        cart.products.push({ productId: req.body.productId, quantity: 1 });
      } else {
        // product already exists in cart
        cart.products[productToAddIndex].quantity++;
        // inform mongoose subdoc changed
        cart.markModified("products");
      }
      await cart.save();

      // reduce total quantity of product
      product.quantity--;
      if (product.quantity == 0) product.available = false;
      await product.save();
      res.status(200).send("Product has been added to cart");
    } else {
      res.status(400).send("Product is not available");
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/", auth, async (req, res) => {
  try {
    // get user cart
    const cart = await Cart.findOne({ userId: req.payload._id, active: true });
    if (!cart) return res.status(400).send("No active cart");

    let promises = [];
    // build promises array for promise.all
    for (let item of cart.products) {
      promises.push(Product.findById(item.productId));
    }

    Promise.all(promises)
      .then((result) => {
        let cartItems = [];
        // unite the arrays
        for (let i in result)
          cartItems.push({
            // toObject - convert doc to object
            // the product properties
            ...result[i].toObject(),
            // the product quantity (chosen by user)
            ...cart.products[i].toObject(),
          });
        res.status(200).send(cartItems);
      })
      .catch((error) => res.status(400).send(error));
  } catch (error) {
    res.status(400).send(error);
  }
});
module.exports = router;
