const express = require('express');
const router = express.Router();
const users = require('../data/users');


let title = 'Amore! Login Page';

router.get('/', async (req, res) => {

    const session = req.session.user;

    if (session) {
        res.redirect('/private');

    }
    res.render('login', { title : title });
    
});

router.post('/login', async (req, res) => {
    const reqBody = req.body;
    let errors = [];

    const { username, password } = reqBody;

        
    const newData = {
        username: username,
        password: password
    }
    if (errors.length > 0) {
        res.status(400).render('login', { errors : errors, hasErrors : true, userInfo : newData, title : title });
        return;
    }

    try{
        
    const value = await users.checkUser(username,password);

    if (!value.authenticated) {
        let errors = "Username and password are not valid.";
        res.status(400).render('login', { errors : errors, hasErrors : true, userInfo : newData, title : title });
        return;
    }
    }catch(e){
        res.status(400).render('login', { errors : e, hasErrors : true, userInfo : newData, title : title });
        return;
    }
    req.session.user = {username: username };
    res.redirect('/private');
});

module.exports = router;