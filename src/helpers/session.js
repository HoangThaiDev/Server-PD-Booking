// Import Models
const Session = require("../model/session");

const checkSession = async (req, res, next) => {
  if (!req.session.user) {
    res.status(400).json({ session: true, message: "Session has expired!" });
    return false;
  }

  const { userId } = req.session.user;

  // Lấy thông tin session từ MongoDB
  const sessionCurrent = await Session.findOne({
    "session.user.userId": userId,
  });

  // Kiểm tra maxAge của session

  const now = new Date();
  const expires = new Date(sessionCurrent.session.cookie.expires);

  if (now > expires) {
    res.status(400).json({ session: true, message: "Session has expired!" });
    return false;
  }
  next();
};

module.exports = checkSession;
