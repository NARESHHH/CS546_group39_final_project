const Joi = require("joi");

module.exports = {
  validateUserSignUp,
  validateUserLogin,
  validateEditUser,
};
const RegEx = new RegExp("^[a-zA-Z0-9]{3,10}$");
/**
 *
 * @param {*} requestBody
 * @return {*} Validate Object
 */

function validateUserSignUp(requestBody) {
  const schema = Joi.object().keys({
    firstName: Joi.string().alphanum().min(1).max(20).required(),
    lastName: Joi.string().alphanum().min(1).max(20).required(),
    username: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ["edu"] } })
      .required(),
    password: Joi.string().required(),
    displayPicture: Joi.string().required(),
    gender: Joi.string().required(),
    age: Joi.number().min(16).max(40).required(),
    description: Joi.string().max(120),
    interests: Joi.string().required(),
    preferences: Joi.object().keys({
      genders: Joi.array().required(),
      age: Joi.object().keys({
        min: Joi.number().min(16).max(80).required(),
        max: Joi.number().min(16).max(80).required(),
      }),
    }),
  });
  return schema.validate(requestBody);
}

/**
 *
 * @param {*} requestBody
 * @return {*} Validate Object
 */

function validateEditUser(requestBody) {
  const schema = Joi.object().keys({
    firstName: Joi.string().alphanum().min(1).max(100).required(),
    lastName: Joi.string().alphanum().min(1).max(100).required(),
    password: Joi.string().required(),
    displayPicture: Joi.string().required(),
    gender: Joi.string().required(),
    age: Joi.number().min(16).max(40).required(),
    description: Joi.string().required(),
    interests: Joi.string().required(),
    preferences: Joi.object().keys({
      genders: Joi.array().required(),
      age: Joi.object().keys({
        min: Joi.number().required(),
        max: Joi.number().required(),
      }),
    }),
  });
  return schema.validate(requestBody);
}

function validateUserLogin(Username, password) {
  const schema = Joi.object().keys({
    username: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(Username, password);
}
