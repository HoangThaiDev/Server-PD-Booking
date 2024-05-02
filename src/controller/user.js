const User = require("../model/user");
const bcrypt = require("bcrypt");

exports.postLoginUser = async (req, res) => {
  const { email, password } = req.body.infoUserLogin;

  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(400).json({
      message: "Email or Password wrong!. Please Check Again!",
    });
    return false;
  }

  const matchPassword = await bcrypt.compare(password, user.password);

  if (matchPassword) {
    res.status(200).json({ message: "Login Success !", user: user.username });
  } else {
    res.status(400).json({ message: "Login Failled !" });
  }
};

exports.postRegisterUser = async (req, res) => {
  const { username, email, password } = req.body.infoUserRegister;
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
