const express = require('express');
const app = express();
const routes = require('./routes');
const init = require('./shared/init');
const logging = require('./middlewares/logging');
const authenticate = require('./middlewares/authenticate');


app.listen(3000, async () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
  await startUp();
});

async function startUp() {
  await init(app);
  app.use(logging);
  app.use(authenticate);
  app.use('/private', async (req, res, next) => {
    let userInfo = req.session.user;
    
    if (!userInfo) {
      let title = 'User is not logged in, Error 403'
      res.status(403).render('private',  {error : true, title : title});
    }
    else {
      next();
    }  
  });
  
  await routes(app);
};

