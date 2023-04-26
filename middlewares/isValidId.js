const { isValidObjectId } = require("mongoose");

const isValidId = (req, res, next) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    next(res.json(400, { message: `${userId} is not valid id` }));
  }

  next();
};

module.exports = { isValidId };
