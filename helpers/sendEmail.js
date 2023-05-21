const sgMail = require("@sendgrid/mail");

require("dotenv").config();

sgMail.setApiKey(process.env.GRID_API_KEY);

const sendEmail = async (data) => {
  const email = { ...data, from: "dzenkinstone@meta.ua" };
  await sgMail.send(email);
  return true;
};

module.exports = {
  sendEmail,
};
