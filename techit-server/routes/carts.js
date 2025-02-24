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
    const product = await Product.findById(req.body.productId);
    if (!product) return res.status(404).send("No such product");

    // get user cart
    const cart = await Cart.findOne({ userId: req.payload._id, active: true });
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
      cart.markModified("products");
    }
    await cart.save();
    res.status(200).send("Product has been added to cart");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
