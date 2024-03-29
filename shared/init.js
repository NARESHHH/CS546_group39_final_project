const express = require("express");
const exphbs = require("express-handlebars");
const Handlebars = require("handlebars");
const mongoInit = require("../shared/mongoConnection");
const session = require("express-session");
const cors = require("cors");

/**
 *
 * @param {*} app
 */
module.exports = function init(app) {
  mongoInit();
  app.use(cors());
  const handlebarsInstance = exphbs.create({
    defaultLayout: "main",
    // Specify helpers which are only registered on this instance.
    helpers: {
      asJSON: (obj, spacing) => {
        if (typeof spacing === "number")
          return new Handlebars.SafeString(JSON.stringify(obj, null, spacing));

        return new Handlebars.SafeString(JSON.stringify(obj));
      },
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
      name: "AuthCookie",
      secret: "P4Mth25rQyB",
      saveUninitialized: true,
      resave: false,
      cookie: { maxAge: 600000 },
    })
  );

  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  app.use(rewriteUnsupportedBrowserMethods);

  app.engine("handlebars", handlebarsInstance.engine);
  app.set("view engine", "handlebars");
};
