exports.getUser = async (req, res, next) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
