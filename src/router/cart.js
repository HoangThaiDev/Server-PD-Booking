// Import Modules
const express = require("express");
const router = express.Router();
const funcSession = require("../helpers/session");

// Import Controllers
const cartController = require("../controller/cart");

router.post("/add-cart", funcSession, cartController.postAddCart);

router.post("/get-carts", funcSession, cartController.getCarts);

router.delete("/delete-cart", funcSession, cartController.deleteCart);

module.exports = router;
