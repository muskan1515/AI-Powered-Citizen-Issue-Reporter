const Joi = require("joi");
const { joiSchemaValidatorWrapper } = require("./index");

module.exports.updateProfileValidator = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  address: Joi.string().max(200).optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  birthDate: Joi.date().optional(),
});

module.exports = {
  profileUpdateValidator: joiSchemaValidatorWrapper(
    this.updateProfileValidator
  ),
};
