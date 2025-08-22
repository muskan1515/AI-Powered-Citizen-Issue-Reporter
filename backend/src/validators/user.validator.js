const Joi = require("joi");
const { joiSchemaValidatorWrapper } = require("./index");

const AddressJoiSchema = Joi.object({
  line1: Joi.string().optional(),
  line2: Joi.string().optional(),
  city: Joi.string().optional(),
  state: Joi.string().optional(),
  postalCode: Joi.string().optional(),
  country: Joi.string().optional(),
}).optional();

const updateProfileValidator = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  gender: Joi.string().valid("male", "female", "other").optional(),
  birthDate: Joi.string().optional(),
  address: AddressJoiSchema,
});

module.exports = {
  profileUpdateValidator: joiSchemaValidatorWrapper(updateProfileValidator),
};
