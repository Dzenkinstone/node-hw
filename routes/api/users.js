const express = require("express");
const {
  userValidation,
  patchValidation,
} = require("../../middlewares/userValidation");

const { isValidId } = require("../../middlewares/isValidId");

const {
  register,
  login,
  current,
  logout,
  subscription,
  updateAvatar,
} = require("../../controllers/users");
const { authentificate } = require("../../middlewares/authentificate");
const { upload } = require("../../middlewares/upload");
const router = express.Router();

router.post("/register", userValidation, register);
router.post("/login", userValidation, login);
router.get("/current", authentificate, current);
router.post("/logout", authentificate, logout);
router.patch("/:userId/subscription", isValidId, patchValidation, subscription);
router.patch("/avatars", authentificate, upload.single("avatar"), updateAvatar);

module.exports = router;
