const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
  },
  price: {
    type: Number,
    required: true,
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
    minlength: 2,
    default:
      "https://www.shutterstock.com/image-vector/missing-picture-page-website-design-600nw-1552421075.jpg",
  },
});

const Product = model("products", productSchema);
module.exports = Product;
