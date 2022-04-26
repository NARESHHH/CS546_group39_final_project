const users = require('../data/users');
const signupRoutes = require('./signUp');
const logInRoutes = require('./logIn');
const privateRoutes = require('./private');
const constructorMethod = (app) => {

  app.use('/', logInRoutes);
  app.use('/login', logInRoutes);
  app.use('/private', privateRoutes);
  app.use('/signup', signupRoutes);
 
  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
  
};

module.exports = constructorMethod;
