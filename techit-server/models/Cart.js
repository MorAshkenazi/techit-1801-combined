const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  userId: {
    type: String,
    required: true,
    minlength: 2,
  },
  products: [
    {
      productId: {
        type: String,
        required: true,
        minlength: 2,
      },
      name: {
        type: String,
        required: true,
        minlength: 2,
      },
      price: {
        type: Number,
        required: true,
        minlength: 2,
      },
      category: {
        type: String,
        required: true,
        minlength: 2,
      },
      description: {
        type: String,
        required: true,
        minlength: 2,
      },
      image: {
        type: String,
        required: true,
        minlength: 2,
      },
      quantity: Number,
    },
  ],
  active: {
    type: Boolean,
    required: true,
  },
});
const Cart = model("carts", cartSchema);
module.exports = Cart;
