const express = require("express");
const Joi = require("joi");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const registerSchema = Joi.object({
  name: Joi.string().required().min(2),
  email: Joi.string().required().email().min(2),
  password: Joi.string().required().min(8),
  isAdmin: Joi.boolean().required(),
});

// register
router.post("/", async (req, res) => {
  try {
    // 1. body validation
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // 2. check for existing user
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already exists");

    // 3. create user + encrypt password
    user = new User(req.body);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    // 4. create token
    const token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      process.env.JWTKEY
    );
    res.status(201).send(token);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
