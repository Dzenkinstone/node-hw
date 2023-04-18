const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const contactsPath = path.resolve(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const contacts = await fs.readFile(contactsPath, "utf8");

    const parsedContacts = JSON.parse(contacts);
    return parsedContacts;
  } catch (error) {
    console.log(error);
  }
};

const getById = async ({ contactId }) => {
  const contacts = await listContacts();
  const findContact = contacts.find((contact) => contact.id === contactId);
  return findContact;
};

const removeContact = async ({ contactId }) => {
  const contacts = await listContacts();
  const checkContact = contacts.map(({ id }) => id).includes(contactId);

  if (!checkContact) {
    return;
  }

  const deleteContact = contacts.filter((contact) => contact.id !== contactId);

  await fs.writeFile(contactsPath, JSON.stringify(deleteContact));
  return deleteContact;
};

const addContact = async (body) => {
  const { name, email, phone } = body;

  const contacts = await listContacts();
  const contact = { id: nanoid(), name, email, phone };
  contacts.push(contact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return contact;
};

const updateContact = async ({ contactId }, body) => {
  const { name, email, phone } = body;

  const contacts = await listContacts();
  const checkContact = contacts.map(({ id }) => id).includes(contactId);

  if (!checkContact) {
    return;
  }

  const updatedContact = [];

  contacts.forEach((item) => {
    if (item.id === contactId) {
      name ? (item.name = name) : item.name;
      email ? (item.email = email) : item.email;
      phone ? (item.phone = phone) : item.phone;

      updatedContact.push({
        id: contactId,
        name: item.name,
        email: item.email,
        phone: item.phone,
      });
    }
  });

  await fs.writeFile(contactsPath, JSON.stringify(contacts));
  return updatedContact[0];
};

module.exports = {
  listContacts,
  getById,
  removeContact,
  addContact,
  updateContact,
};
