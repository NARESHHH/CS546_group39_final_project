const users = require('../data/users');
const constructorMethod = (app) => {
  app.post('/signup', async function (req, res, next) {
    return await users.signUp(req, res, next);
  });

  app.use('*', (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
