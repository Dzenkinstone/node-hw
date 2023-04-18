const Joi = require("joi");

module.exports = {
  postContactValidation: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().alphanum().required(),
      email: Joi.string().required(),
      phone: Joi.string().alphanum().required(),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      const emptyColumns = validationResult.error.details[0].path;

      return res.json(400, {
        message: `missing required ${emptyColumns.join()} field`,
      });
    }

    next();
  },

  putContactValidation: (req, res, next) => {
    if (!req.body.name && !req.body.email && !req.body.phone) {
      return res.json(400, { message: "missing fields" });
    }

    const schema = Joi.object({
      name: Joi.string().alphanum(),
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
};
