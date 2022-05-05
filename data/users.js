const Users = require('../models/users');
const validator = require('../validators/users');
const ClientError = require('../shared/client-error');
const ServerError = require('../shared/server-error');
const bcrypt = require('bcrypt');
const { preferences } = require('joi');
const salt = 10;


module.exports = {
    getLoginPage,
    getSignUpPage,
    login,
    signUp,
};

async function getLoginPage(req, res, next) {
    try {
        return res.render('users/login');
    } catch (error) {
        if (error instanceof ServerError) {
            next(error);
        }
        next(new ServerError(500, error.message));
    }
};


async function getSignUpPage(req, res, next) {
    try {
        return res.render('users/signup');
    } catch (error) {
        if (error instanceof ServerError) {
            next(error);
        }
        next(new ServerError(500, error.message));
    }
};

async function login(req, res, next) {
    try {
        const reqBody = req.body;
        
        const { error } = validator.validateUserLogin(reqBody);
            if (error) {
              throw new ServerError(400, error.message);
            }
            
        const username = reqBody.username;
        const password = reqBody.password;
    
        const user = await Users.findOne({username: username.toLowerCase()});
    
        if (!user) {
            throw new ServerError(400, `User does not exists with given username ${username}`);
        }
    
        if (!await bcrypt.compare(password, user.password)) {
            throw new ServerError(400, 'Password does not match, Please Re-enter password');
        }
    
        req.session.user = user.id;
    
        return res.redirect('/users/getRecommendations');
        
    } catch (error) {
        if (error instanceof ServerError) {
            next(error);
        }
        next(new ServerError(500, error.message));
    }
}

async function signUp(req, res, next) {
    try {
        const requestBody = req.body;
    
        const { error } = validator.validateUserSignUp(requestBody);
        if (error) {
          throw new ServerError(400, error.message);
        }
        
        const username = requestBody.username.toLowerCase();

        const user = await Users.findOne({ username: username});

        if (user) throw new ServerError(400, 'User already exists with given username');

        const password = await bcrypt.hash(requestBody.password, salt);

        await Users.create({
            firstName: requestBody.firstName,
            lastName: requestBody.lastName,
            username: requestBody.username,
            password: requestBody.password,
            phone:requestBody.phone,
            gender:requestBody.gender,
            hobbies:requestBody.hobbies,
            description:requestBody.description,
            preferences: requestBody.preferences,
        });

        return res.send("user created successfully");
    } catch (error) {
        if (error instanceof ServerError) {
            next(error);
        }
        next(new ServerError(500, error.message));
    }

}
