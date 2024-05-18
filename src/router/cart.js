// Import Modules
const express = require("express");
const router = express.Router();
const funcSession = require("../helpers/session");
// Import Controllers
const cartController = require("../controller/cart");

router.post("/add-cart", cartController.postAddCart);

router.post("/get-carts", cartController.getCarts);

router.delete("/delete-cart", cartController.deleteCart);

module.exports = router;
