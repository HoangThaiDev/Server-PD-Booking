const express = require("express");
const router = express.Router();
const userController = require("../controller/user");

router.post("/login", userController.postLoginUser);

router.post("/register", userController.postRegisterUser);

module.exports = router;
