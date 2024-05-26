// Import Modules
const express = require("express");
const router = express.Router();
const funcSession = require("../helpers/session");

// Import Controllers
const checkoutController = require("../controller/checkout");

router.post("/add-checkout", funcSession, checkoutController.postAddCheckout);

router.get(
  "/get-checkout/:userId",
  funcSession,
  checkoutController.getCheckoutByUserId
);

router.post("/update", funcSession, checkoutController.postUpdateCheckout);

module.exports = router;
