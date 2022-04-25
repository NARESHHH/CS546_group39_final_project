const Joi = require('joi');

module.exports = {
    validateUserSignUp,
}

/**
 * 
 * @param {*} requestBody 
  * @return {*} Validate Object
 */
 function validateUserSignUp(requestBody) {
     const schema = Joi.object().keys({
         firstName: Joi.string().min(1).required(),
         lastName: Joi.string().min(1).required(),
         username: Joi.string().email().required(),
         password: Joi.string().required(),
    });
    return schema.validate(requestBody);
  
};