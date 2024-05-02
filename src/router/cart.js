const express = require("express");
const cartController = require("../controller/cart");
const router = express.Router();

router.post("/add-cart", cartController.postAddCart);

router.get("/get-carts", cartController.getCarts);

router.delete("/delete-cart", cartController.deleteCart);
module.exports = router;
