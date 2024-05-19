// Import Modules
const express = require("express");
const router = express.Router();
const functSession = require("../helpers/session");

// Import Controllers
const userController = require("../controller/user");

router.get("/login", userController.getLogin);

router.post("/login", userController.postLoginUser);

router.post("/register", userController.postRegisterUser);

router.get("/get-user/:userId", functSession, userController.getUser);

module.exports = router;
