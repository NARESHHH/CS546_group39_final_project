const Joi = require('joi');

module.exports = {
    validateUserSignUp,
    validateUserLogin
}
const RegEx= new RegExp('^[a-zA-Z0-9]{3,10}$')
/**
 * 
 * @param {*} requestBody 
  * @return {*} Validate Object
 */

 function validateUserSignUp(requestBody) {
     const schema = Joi.object().keys({
         firstName: Joi.string()
                    .alphanum()
                    .min(1)
                    .max()
                    .required(),
         lastName: Joi.string()
                    .alphanum()
                    .min(1)
                    .max()
                    .required(),
         email: Joi.string()
                    .email({minDomainSegments: 2, tlds:{allow:["edu"]}})
                    .required(),
         username: Joi.string()
                    .email()
                    .required(),
         password: Joi.string()
                    .required(),
        gender: Joi.string()
                .required(),
        dateOfBirth: Joi.date()
                        .raw()
                        .required(),
        UserInfo: Joi.string()
                .required(),
        interestsText: Joi.string()
                .required(),
        hobbies: Joi.array(Joi.string()).required(),
        preferences: Joi.object().keys({
            genders: Joi.array(Joi.string()).required(),
            age: Joi.object().keys({
                min: Joi.number().required(),
                max: Joi.number().required()
            })
        })

        



    });
    return schema.validate(requestBody);
  
};

function validateUserLogin(Username,password) {
    const schema = Joi.object().keys({
        username: Joi.string().email().required(),
        password: Joi.string().required(),
   });
   return schema.validate(Username,password);
 
};