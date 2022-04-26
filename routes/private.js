const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => { 
    const session = req.session.user;
    const { username } = session;
    if (!username) {
        errors.push(`No user with ${username} found.`); 
        res.status(401).render('login', { errors : errors, hasErrors : true, userInfo : userInfo, title : title });
        return;
    }
    const title = `Hello ${username}, Successfully logged in!!!!!!`;
    res.render('private', {title : title });
});

module.exports = router;