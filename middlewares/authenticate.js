const noAuthRoutes = require("../shared/no-auth-routes.json");
const userRoutes = require("../shared/user-routes.json");
const Users = require("../models/users");
const ServerError = require("../shared/server-error");

module.exports = async (req, res, next) => {
  try {
    if (
      noAuthRoutes[req.originalUrl] &&
      noAuthRoutes[req.originalUrl].includes(req.method)
    ) {
      const ip = req.headers["x-forwarded-for"] || "148.75.0.38";
      req.user = {
        ip: ip,
      };
      next();
    } else if (req.originalUrl == "/") return res.redirect("/users/login");
    else if (
      userRoutes[req.originalUrl] &&
      userRoutes[req.originalUrl].includes(req.method)
    ) {
      if (req.session.user) {
        req.user = req.session.user;
        const user = await Users.findOne({ _id: req.user.id });
        if (!user) throw new ServerError(400, "User does not exists");
        next();
      } else {
        return res.redirect("/users/login");
      }
    }
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }
    throw new ServerError(500, "Internal Server Error");
  }
};
