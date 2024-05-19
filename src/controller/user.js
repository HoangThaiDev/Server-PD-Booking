// Import Modules
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const {
  checkValidateFormRegister,
  checkValideFormLogin,
} = require("../middleware/user/validation");

// Import Models
const User = require("../model/user");

exports.getLogin = async (req, res) => {
  if (req.session.isLoggedIn) {
    res.status(200).json({
      isLoggedIn: req.session.isLoggedIn,
      user: {
        userId: req.session.user.userId,
        username: req.session.user.username,
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
  const valueUserValid = checkValideFormLogin(email, password);
  if (valueUserValid.length > 0) {
    res.status(400).json({
      message: undefined,
      messages: valueUserValid,
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
  const valueUserValid = checkValidateFormRegister(
    username,
    email,
    password,
    confirmPassword
  );
  if (valueUserValid.length > 0) {
    res.status(400).json({
      message: undefined,
      messages: valueUserValid,
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

exports.getUser = async (req, res) => {
  console.log(req.params.userId);
};
