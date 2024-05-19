// Import Modules
const express = require("express");
const router = express.Router();
const funcSession = require("../helpers/session");

// Import Controllers
const checkoutController = require("../controller/checkout");

router.post("/add-checkout", funcSession, checkoutController.postAddCheckout);

router.post(
  "/get-checkout/:userId",
  funcSession,
  checkoutController.getCheckoutByUserId
);

module.exports = router;
