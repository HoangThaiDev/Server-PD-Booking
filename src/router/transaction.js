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

router.get(
  "/detail/:transactionId",
  funcSession,
  transactionController.getDetailTransaction
);

router.delete(
  "/detail/:transactionId",
  funcSession,
  transactionController.deleteDetailTransaction
);

router.post(
  "/delete-item/:itemId",
  funcSession,
  transactionController.getDeleteItemTrans
);

module.exports = router;
