const Joi = require("joi");
const { joiSchemaValidatorWrapper } = require(".");
// Define schemas
const signupSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("user", "admin").optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
  token: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

module.exports = {
  signupValidator: joiSchemaValidatorWrapper(signupSchema),
  loginValidator: joiSchemaValidatorWrapper(loginSchema),
  forgotPasswordValidator: joiSchemaValidatorWrapper(forgotPasswordSchema),
  resetPasswordValidator: joiSchemaValidatorWrapper(resetPasswordSchema),
};
