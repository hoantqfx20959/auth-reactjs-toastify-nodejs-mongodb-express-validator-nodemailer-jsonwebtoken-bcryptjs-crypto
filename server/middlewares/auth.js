module.exports.checkUser = (req, res, next) => {
  if (req.user.isClient) {
    res.json({ status: true, user: req.user.username });
  } else {
    res.json({ status: false });
  }
  next();
};

module.exports.checkAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    res.json({ status: true, user: req.user.username });
  } else {
    res.json({ status: false });
  }
  next();
};
