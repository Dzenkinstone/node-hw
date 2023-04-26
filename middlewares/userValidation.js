const Joi = require("joi");

const emailRegexp = /^(\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+[,;]?[ ]?)+$/;

module.exports = {
  userValidation: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().pattern(emailRegexp).required(),
      password: Joi.string().min(6).required().messages({
        "string.min": `"password" should have a minimum length of 6`,
      }),
    });

    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
      return res.json(400, {
        message: validationResult.error.message,
      });
    }

    next();
  },

  patchValidation: (req, res, next) => {
    const schema = Joi.object({
      subscription: Joi.string().required(),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      return res.json(400, {
        message: validationResult.error.details[0].message,
      });
    }

    next();
  },
};
