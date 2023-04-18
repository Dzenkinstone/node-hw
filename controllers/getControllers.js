const {
  listContacts,
  getById,
  addContact,
  removeContact,
  updateContact,
} = require("../models/contacts");

const getController = async (req, res, next) => {
  const contacts = await listContacts();
  res.json(contacts);
};

const getByIdController = async (req, res, next) => {
  const findContact = await getById(req.params);

  if (!findContact) {
    return res.json(404, { message: "Not Found" });
  }
  res.json(200, findContact);
};

const postController = async (req, res, next) => {
  const newContact = await addContact(req.body);

  res.json(201, newContact);
};

const deleteController = async (req, res, next) => {
  const deleteContact = await removeContact(req.params);

  if (!deleteContact) {
    return res.json(404, { message: "Not found" });
  }

  res.json(200, { message: "contact deleted" });
};

const putController = async (req, res, next) => {
  const replaceContact = await updateContact(req.params, req.body);

  if (!replaceContact) {
    return res.json(404, { message: "Not found" });
  }

  res.json(200, replaceContact);
};

module.exports = {
  getController,
  getByIdController,
  postController,
  deleteController,
  putController,
};
