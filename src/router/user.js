// Import Modules
const express = require("express");
const router = express.Router();

// Import Controllers
const userController = require("../controller/user");

router.get("/login", userController.getLogin);

router.post("/login", userController.postLoginUser);

router.post("/register", userController.postRegisterUser);

module.exports = router;
