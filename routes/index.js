const users = require("./users");
const users = require("./notifications");

const constructorMethod = (app) => {
  app.use("/users", users);
  app.use("/notifications", users);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
