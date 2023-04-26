const bcrypt = require("bcrypt");
const { User } = require("../models/users");

const { controlWrapper } = require("../helpers/controlWrapper");
const jwt = require("jsonwebtoken");
const { HttpError } = require("../helpers/HttpError");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const contacts = await User.create({
    email,
    password: hashedPassword,
  });

  res.json(201, {
    user: { email: contacts.email, subscription: contacts.subscription },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = {
    id: user._id,
  };

  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "23h" });

  await User.findByIdAndUpdate(user._id, { token });

  res.json(200, {
    token,
    user: { email: user.email, subscription: user.subscription },
  });
};

const current = async (req, res, next) => {
  const { email, subscription } = req.user;

  res.json(200, { email, subscription });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;

  await User.findByIdAndUpdate(_id, { token: "" });

  res.json(204, { message: "Logout sucess" });
};

const subscription = async (req, res, next) => {
  const { userId } = req.params;
  const replaceContact = await User.findByIdAndUpdate(userId, req.body, {
    new: true,
  });

  if (!replaceContact) {
    throw HttpError(404, "Not Found");
  }

  res.json(200, replaceContact);
};

module.exports = {
  register: controlWrapper(register),
  login: controlWrapper(login),
  current: controlWrapper(current),
  logout: controlWrapper(logout),
  subscription: controlWrapper(subscription),
};
