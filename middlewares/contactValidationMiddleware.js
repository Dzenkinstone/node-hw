const Joi = require("joi");

module.exports = {
  postContactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().alphanum().required(),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      return res.json(400, {
        message: `${validationResult.error.message}`,
      });
    }

    next();
  },

  putContactValidation: (req, res, next) => {
    if (!req.body.name && !req.body.email && !req.body.phone) {
      return res.json(400, { message: "missing fields" });
    }

    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string(),
      phone: Joi.string().alphanum(),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      return res.json(400, {
        message: validationResult.error.details[0].message,
      });
    }

    next();
  },

  patchValidation: (req, res, next) => {
    const schema = Joi.object({
      favorite: Joi.boolean().required(),
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
