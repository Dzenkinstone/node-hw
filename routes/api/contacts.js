const express = require("express");

const {
  putContactValidation,
  postContactValidation,
} = require("../../middlewares/validationMiddleware");
const {
  getController,
  getByIdController,
  deleteController,
  postController,
  putController,
} = require("../../controllers/getControllers");

const router = express.Router();

router.get("/", getController);

router.get("/:contactId", getByIdController);

router.post("/", postContactValidation, postController);

router.delete("/:contactId", deleteController, deleteController);

router.put("/:contactId", putContactValidation, putController);

module.exports = router;
