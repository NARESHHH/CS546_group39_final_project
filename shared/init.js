const express = require('express');
const static = express.static(__dirname + '/public');
const exphbs = require('express-handlebars');
const Handlebars = require('handlebars');
const mongoInit = require('../shared/mongoConnection');
const session = require('express-session');

/**
 *
 * @param {*} app
 */
module.exports = async function init(app) {
    mongoInit();
    const handlebarsInstance = exphbs.create({
      defaultLayout: 'main',
      // Specify helpers which are only registered on this instance.
      helpers: {
        asJSON: (obj, spacing) => {
          if (typeof spacing === 'number')
            return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));
    
          return new Handlebars.SafeString(JSON.stringify(obj));
        }
      },
    });
    
    const rewriteUnsupportedBrowserMethods = (req, res, next) => {
      // If the user posts to the server with a property called _method, rewrite the request's method
      // To be that method; so if they post _method=PUT you can now allow browsers to POST to a route that gets
      // rewritten in this middleware to a PUT route
      if (req.body && req.body._method) {
        req.method = req.body._method;
        delete req.body._method;
      }
    
      // let the next middleware run:
      next();
  };
  app.use(
      session({
          name: 'AuthCookie',
          secret: 'P4Mth25rQyB',
          saveUninitialized: true,
          resave: false,
          cookie: { maxAge: 60000 }
      })
  );
    
    app.use('/public', static);
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(rewriteUnsupportedBrowserMethods);
    
    app.engine('handlebars', handlebarsInstance.engine);
    app.set('view engine', 'handlebars');
    
  
    process.on('uncaughtException', (ex) => {
      console.log(ex);
    });
  
    process.on('unhandledRejection', (ex) => {
      console.log(ex);
    });
  };
  