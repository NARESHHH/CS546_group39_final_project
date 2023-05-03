const users = require("./users");
const notifications = require("./notifications");

const constructorMethod = (app) => {
  app.use("/users", users);
  app.use("/notifications", notifications);

  app.use("*", (req, res) => {
    res.sendStatus(404);
  });
};

module.exports = constructorMethod;
