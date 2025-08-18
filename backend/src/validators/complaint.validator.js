const Joi = require("joi");
const {joiSchemaValidatorWrapper} = require("./index");

// Define complaint schema
const createComplaintSchema = Joi.object({
  text: Joi.string().min(5).required().messages({
    "string.base": "Text must be a string",
    "string.min": "Text required (>=5 chars)",
    "any.required": "Text is required",
  }),
  location: Joi.object({
    lat: Joi.number().min(-90).max(90).required().messages({
      "number.base": "Latitude must be a number",
      "number.min": "Latitude cannot be less than -90",
      "number.max": "Latitude cannot be greater than 90",
      "any.required": "Latitude is required",
    }),
    lng: Joi.number().min(-180).max(180).required().messages({
      "number.base": "Longitude must be a number",
      "number.min": "Longitude cannot be less than -180",
      "number.max": "Longitude cannot be greater than 180",
      "any.required": "Longitude is required",
    }),
  }).required(),
});

module.exports = {
  validateCreateComplaint: joiSchemaValidatorWrapper(createComplaintSchema),
};
