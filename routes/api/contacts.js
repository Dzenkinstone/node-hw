const express = require("express");

const {
  putContactValidation,
  postContactValidation,
  patchValidation,
} = require("../../middlewares/contactValidationMiddleware");
const {
  getController,
  getByIdController,
  deleteController,
  postController,
  putController,
  patchController,
} = require("../../controllers/contacts");
const { isValidId } = require("../../middlewares/isValidId");
const { authentificate } = require("../../middlewares/authentificate");

const router = express.Router();

router.get("/", authentificate, getController);

router.get("/:contactId", authentificate, isValidId, getByIdController);

router.post("/", authentificate, postContactValidation, postController);

router.delete(
  "/:contactId",
  authentificate,
  isValidId,
  deleteController,
  deleteController
);

router.put(
  "/:contactId",
  authentificate,
  isValidId,
  putContactValidation,
  putController
);

router.patch(
  "/:contactId/favorite",
  authentificate,
  isValidId,
  patchValidation,
  patchController
);

module.exports = router;
