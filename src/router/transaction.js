// Import Modules
const express = require("express");
const transactionController = require("../controller/transaction");
const funcSession = require("../helpers/session");

// Import Controllers
const router = express.Router();

router.get(
  "/get-transaction/:userId",
  funcSession,
  transactionController.getTransactionByUserId
);

module.exports = router;
