const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const { User } = require("../models/users");
const { controlWrapper } = require("../helpers/controlWrapper");
const { HttpError } = require("../helpers/HttpError");
const Jimp = require("jimp");
const { nanoid } = require("nanoid");
const { sendEmail } = require("../helpers/sendEmail");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const avatarURL = gravatar.url(email);
  const verificationToken = nanoid();

  const contacts = await User.create({
    email,
    password: hashedPassword,
    avatarURL,
    verificationToken,
  });

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${process.env.BASE_URL}/users/verify/${verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json(201, {
    user: { email: contacts.email, subscription: contacts.subscription },
  });
};

const verifyEmail = async (req, res, next) => {
  const { verificationToken } = req.params;
  const user = User.findOne({ verificationToken });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  await User.findByIdAndUpdate(user._id, {
    verificationToken: null,
    verify: true,
  });

  res.json(200, {
    message: "Verification successful",
  });
};

const resendVerifyEmail = async (req, res, next) => {
  const { email } = req.body;

  const user = User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email not found");
  }

  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }

  const verifyEmail = {
    to: email,
    subject: "Verify email",
    html: `<a target="_blank" href="${process.env.BASE_URL}/users/verify/${user.verificationToken}">Click verify email</a>`,
  };

  await sendEmail(verifyEmail);

  res.json(200, {
    message: "Verification email sent",
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  if (!user.verify) {
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

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const filename = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, filename);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatars", filename);
  const image = await Jimp.read(resultUpload);
  await image.resize(250, 250);
  await image.writeAsync(resultUpload);
  await User.findByIdAndUpdate(_id, { avatarURL });
  res.json({ avatarURL });
};

module.exports = {
  register: controlWrapper(register),
  verifyEmail: controlWrapper(verifyEmail),
  resendVerifyEmail: controlWrapper(resendVerifyEmail),
  login: controlWrapper(login),
  current: controlWrapper(current),
  logout: controlWrapper(logout),
  subscription: controlWrapper(subscription),
  updateAvatar: controlWrapper(updateAvatar),
};
