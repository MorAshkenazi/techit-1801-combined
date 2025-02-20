const express = require("express");
const auth = require("../middlewares/auth");
const Joi = require("joi");
const Product = require("../models/Product");
const router = express.Router();

const productsSchema = Joi.object({
  name: Joi.string().required().min(2),
  price: Joi.number().required(),
  category: Joi.string().required().min(2),
  description: Joi.string().required().min(2),
  image: Joi.string().uri(),
});

// add product
router.post("/", auth, async (req, res) => {
  try {
    // 1. check if user is an admin
    if (!req.payload.isAdmin) return res.status(401).send("Access denied");

    // 2. body validation
    const { error } = productsSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // 3. check for existing product
    let product = await Product.findOne({ name: req.body.name });
    if (product) return res.status(400).send("Product already exists");

    // 4. add product
    product = new Product(req.body);
    await product.save();
    res.status(201).send("Product has been added successfully :)");
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
