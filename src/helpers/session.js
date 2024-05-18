const checkSession = (req, res, next) => {
  const currentSession = req.session.isLoggedIn;

  console.log(currentSession);
};

module.exports = checkSession;
