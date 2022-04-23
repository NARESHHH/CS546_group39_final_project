const Users = require('../models/users');
const validator = require('../validators/users');
const bcrypt = require('bcrypt');
const salt = 10;

module.exports = {
    signUp,
};

async function signUp(req, res, next) {
    try {
        const requestBody = req.body;
    
        const { error } = validator.validateUserSignUp(requestBody);
        if (error) {
          throw error.message;
        }
        
        const username = requestBody.username.toLowerCase();

        const user = await Users.findOne({ username: username});

        if (user) throw 'User already exists with given username';

        const password = await bcrypt.hash(requestBody.password, salt);

        await Users.create({
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            username: username,
            password: password,
        });

        return res.status(200).send('User created Succesfully!');
        
    } catch (error) {
        return res.status(400).send(error);
    }

}