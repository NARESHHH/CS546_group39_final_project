const express = require('express');
const router = express.Router();
const users = require('../data/users');

let title = "Amore! signUp"
router.get("/",async (req,res,next)=>{
    const session = req.session.user;
    if (session) {
        console.log("session in use");
    }
    res.render('signup', { title : title });

});

router.post("/",async (req,res,next)=>{
    const reqBody = req.body;
    let errors = [];
    const { firstName , lastName , username, password } = reqBody;

   
    const newUser = {
        firstName,
        lastName,
        username: username,
        password: password
    }

    if (errors.length > 0) {
        res.status(400).render('signup', { errors : errors, hasErrors : true, userInfo : newUser, title : title });
        return;
    }

    try{
    const value = await users.signUp(req,res,next);

    // if(value == 'undefined'){
    //     res.status(500).render('login', { errors : "Internal Server Error", hasErrors : true, userInfo : newUser, title : title });
    //     return;
    // }

    // if (!value.userInserted) {
    //     errors.push(`No user with ${username} found.`); 
    //     res.status(400).render('login', { errors : errors, hasErrors : true, userInfo : newUser, title : title });
    //     return;
    // }

    }catch(e){
        errors.push(e);
        res.status(400).render('login', { errors : errors, hasErrors : true, userInfo : newUser, title : title });
        return;
    }
    res.redirect('/login'); 

});

module.exports = router;