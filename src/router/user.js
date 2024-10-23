// Import Modules
const express = require("express");
const router = express.Router();
const functSession = require("../helpers/session");

// Import Controllers
const userController = require("../controller/user");

router.get("/login", userController.getLogin);

router.post("/login", userController.postLoginUser);

router.post("/register", userController.postRegisterUser);

router.post("/updated/:userId", functSession, userController.postUpdateUser);

router.post(
  "/change-password/:userId",
  functSession,
  userController.postChangePassword
);

router.post("/auth-email", userController.postAuthEmail);

router.post("/create-newPassword", userController.postCreateNewPassword);

router.get("/logout/:userId", userController.getLogout);

module.exports = router;
