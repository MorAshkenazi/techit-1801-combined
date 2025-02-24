const express = require("express");
const auth = require("../middlewares/auth");
const Joi = require("joi");
const Product = require("../models/Product");
const router = express.Router();

// מלאי ראשוני מכל מוצר: 5
// כל הוספה לעגלה מורידה מהמלאי הכולל
// ברגע שהמלאי יורד ל0 אז סטטוס משתנה
// available: false

const productsSchema = Joi.object({
  name: Joi.string().required().min(2),
  price: Joi.number().required(),
  category: Joi.string().required().min(2),
  description: Joi.string().required().min(2),
  image: Joi.string().uri(),
  available: Joi.boolean(),
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

router.get("/", auth, async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).send(products);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get("/:productId", auth, async (req, res) => {
  try {
    // check if product exists
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(400).send("No such product");
    res.status(200).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
