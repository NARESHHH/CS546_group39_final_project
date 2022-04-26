const Users = require('../models/users');
const validator = require('../validators/users');
const bcrypt = require('bcrypt');
const salt = 10;


const checkUser = async (username,password)=>{

    
    const { error } = validator.validateUserSignUp();
        if (error) {
          throw error.message;
        }
        
    const user = await Users.findOne({username: username.toLowerCase()});

    if (user === null) {
        throw new Error("Error Occured: Check username and password");
    }

    let compareFlag = false;

    if(user.username == username.toLowerCase()){
        try {
            compareFlag = await bcrypt.compare(password, user.password);
        } catch (e) {
            throw new Error(e);
        }
    }

    if (compareFlag) {
        return {authenticated: true};
    } else {
        throw new Error("Error Occured: Check username and password");
    }
}
module.exports = {
    signUp,
    checkUser
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

        return;
        
    } catch (error) {
        return res.status(400).send(error);
    }

}
