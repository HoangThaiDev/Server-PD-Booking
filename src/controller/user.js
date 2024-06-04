// Import Modules
const bcrypt = require("bcrypt");

// Import Middlewares
const mongoose = require("mongoose");
const {
  checkValidateFormRegister,
  checkValidateFormLogin,
  checkValidateFormUpdate,
  checkValidateFormChangePassword,
  checkValidateFormForgotPassword,
  checkValidateFormCreateNewPassword,
} = require("../middleware/user/validation");

// Import Models
const Session = require("../model/session");
const User = require("../model/user");

exports.getLogin = async (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({
      isLoggedIn: req.session.isLoggedIn,
      user: {
        userId: req.session.user.userId,
        username: req.session.user.username,
        detail: req.session.user.detail,
      },
    });
  } else {
    req.session.destroy(() => {
      res.status(203).json({ isLoggedIn: false });
    });
  }
};

exports.postLoginUser = async (req, res) => {
  const { email, password } = req.body.infoUserLogin;

  const valueUserInValid = checkValidateFormLogin(email, password);
  if (valueUserInValid.length > 0) {
    res.status(400).json({
      checkValidateForm: true,
      messages: valueUserInValid,
    });
    return false;
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(400).json({
      message: "Email or Password wrong!",
    });
    return false;
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (matchPassword) {
    req.session.isLoggedIn = true;
    req.session.user = {
      userId: new mongoose.Types.ObjectId(user._id),
      username: user.username,
      detail: user.detail,
    };
    res.status(200).json({
      message: "Login Success!",
    });
  } else {
    res.status(400).json({ message: "Login Failled!" });
  }
};

exports.postRegisterUser = async (req, res) => {
  const { username, email, password, confirmPassword } =
    req.body.infoUserRegister;
  const valueUserInValid = checkValidateFormRegister(
    username,
    email,
    password,
    confirmPassword
  );
  if (valueUserInValid.length > 0) {
    res.status(400).json({
      checkValidateForm: true,
      messages: valueUserInValid,
    });
    return false;
  }
  const hashPassword = await bcrypt.hash(password, 12);
  const userExist = await User.findOne().or([
    { email: email },
    { username: username },
  ]);

  if (userExist?.username === username) {
    res.status(400).json({
      message: "Username is already in use!",
    });
    return false;
  }

  if (userExist?.email === email) {
    res.status(400).json({ message: "Email is already in use!" });
    return false;
  }

  const user = new User({
    username: username,
    email: email,
    password: hashPassword,
  });
  res.status(200).json({ message: "Sign Up Success!" });
  return user.save();
};

exports.postUpdateUser = async (req, res) => {
  const { userId } = req.params;
  const { valueFormUpdateUser } = req.body;

  const valueUserInValid = checkValidateFormUpdate(valueFormUpdateUser);

  if (valueUserInValid.length > 0) {
    res.status(400).json({
      checkValidateForm: true,
      messages: valueUserInValid,
    });
    return false;
  }

  try {
    const user = await User.findByIdAndUpdate(userId, {
      "detail.firstname": valueFormUpdateUser.firstname,
      "detail.lastname": valueFormUpdateUser.lastname,
      "detail.country": valueFormUpdateUser.country,
      "detail.streetAddress": valueFormUpdateUser.address,
      "detail.city": valueFormUpdateUser.city,
      "detail.phoneNumber": valueFormUpdateUser.phone,
    });

    if (user) {
      res.status(200).json({ message: "Update User Success!" });
      return false;
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Update User Failled!" });
  }
};

exports.getLogout = async (req, res) => {
  const { userId } = req.params;

  // Lấy thông tin session từ MongoDB
  const session = await Session.findOneAndDelete({
    "session.user.userId": new mongoose.Types.ObjectId(userId),
  });
  if (session) {
    res.status(200).json({ message: "Logout Success!" });
  }
};

exports.postChangePassword = async (req, res) => {
  const { userId } = req.params;
  const { valueFormUpdateUser } = req.body;

  // Check validate value form client
  const valueUserInValid = checkValidateFormChangePassword(valueFormUpdateUser);

  if (valueUserInValid.length > 0) {
    res.status(400).json({
      checkValidateForm: true,
      messages: valueUserInValid,
    });
    return false;
  }

  // Find User By Id in Dbs
  const findUser = await User.findById(userId);
  const matchedPassword = await bcrypt.compare(
    valueFormUpdateUser.passwordCurrent,
    findUser.password
  );

  // Check value password compare with password of user in dbs
  if (!matchedPassword) {
    res
      .status(400)
      .json({ session: false, message: "Password current is wrong!" });
    return false;
  }

  // Update field password in dbs
  findUser.password = await bcrypt.hash(valueFormUpdateUser.newPassword, 12);
  findUser.save();
  res.status(200).json({ message: "Change password is Success!" });
  return false;
};

exports.postAuthEmail = async (req, res) => {
  const { email } = req.body.infoUser;

  // Check validate value form client
  const valueUserInValid = checkValidateFormForgotPassword(email);

  if (valueUserInValid.length > 0) {
    res.status(400).json({
      checkValidateForm: true,
      messages: valueUserInValid,
    });
    return false;
  }

  const findedUser = await User.findOne({ email: email });

  if (!findedUser) {
    res.status(400).json({ message: "Your Email is incorrect!" });
    return false;
  }
  res
    .status(200)
    .json({ userId: findedUser._id, message: "Your Email is correct!" });
};

exports.postCreateNewPassword = async (req, res) => {
  const { userId, password, confirmPassword } = req.body.infoUser;

  // Check validate value form client
  const valueUserInValid = checkValidateFormCreateNewPassword(
    password,
    confirmPassword
  );

  if (valueUserInValid.length > 0) {
    res.status(400).json({
      checkValidateForm: true,
      messages: valueUserInValid,
    });
    return false;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await User.findByIdAndUpdate(
    { _id: userId },
    { password: passwordHash }
  );

  if (!user) {
    res.status(400).json({ message: "Create new password is failled!" });
    return false;
  }
  res.status(200).json({ message: "Create new password is success!" });
};
