const { Contact } = require("../models/contacts");
const { HttpError } = require("../helpers/HttpError");

const { controlWrapper } = require("../helpers/controlWrapper");

const getController = async (req, res, next) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;

  if (!favorite) {
    const contacts = await Contact.find({ owner }, "", {
      skip,
      limit,
    });

    return res.json(contacts);
  }

  const contacts = await Contact.find({ owner, favorite }, "", { skip, limit });
  res.json(contacts);
};

const getByIdController = async (req, res, next) => {
  const { contactId } = req.params;
  const findContact = await Contact.findById(contactId);

  if (!findContact) {
    throw HttpError(404, "Not Found");
  }
  res.json(200, findContact);
};

const postController = async (req, res, next) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });

  res.json(201, newContact);
};

const deleteController = async (req, res, next) => {
  const { contactId } = req.params;

  const deleteContact = await Contact.findByIdAndDelete(contactId);

  if (!deleteContact) {
    throw HttpError(404, "Not Found");
  }

  res.json(200, { message: "contact deleted" });
};

const putController = async (req, res, next) => {
  const { contactId } = req.params;
  const { name, phone, email } = req.body;

  const replaceContact = await Contact.findByIdAndUpdate(
    contactId,
    {
      $set: { name, phone, email },
    },
    { new: true }
  );

  if (!replaceContact) {
    throw HttpError(404, "Not Found");
  }

  res.json(200, replaceContact);
};

const patchController = async (req, res, next) => {
  const { contactId } = req.params;

  const replaceContact = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  if (!replaceContact) {
    throw HttpError(404, "Not Found");
  }

  res.json(200, replaceContact);
};

module.exports = {
  getController: controlWrapper(getController),
  getByIdController: controlWrapper(getByIdController),
  postController: controlWrapper(postController),
  deleteController: controlWrapper(deleteController),
  putController: controlWrapper(putController),
  patchController: controlWrapper(patchController),
};
