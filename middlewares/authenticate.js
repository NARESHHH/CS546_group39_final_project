const noAuthRoutes = require("../shared/no-auth-routes.json");
const userRoutes = require("../shared/user-routes.json");
const Users = require("../models/users");
const ServerError = require("../shared/server-error");

module.exports = async (req, res, next) => {
  try {
    const path = getCustomRouteURL(req.path);
    if (noAuthRoutes[path] && noAuthRoutes[path].includes(req.method)) {
      const ip = req.headers["x-forwarded-for"] || "148.75.0.38";
      req.user = {
        ip: ip,
      };
      next();
    } else if (path == "/") return res.redirect("/users/login");
    else if (userRoutes[path] && userRoutes[path].includes(req.method)) {
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
      next(error);
    }
    next(new ServerError(500, "Internal Server Error"));
  }
};

/**
 *
 * @param {*} path
 * @return {*}
 */
function getCustomRouteURL(path) {
  if (path != "") {
    // ignore quey params
    const index = path.indexOf("?");
    if (index !== -1) {
      path = path.slice(0, index);
    }
  }

  const paths = path.split("/");

  let newURL = "";
  if (paths && paths.length > 0) {
    for (let index = 1; index < paths.length; index++) {
      let element = paths[index];
      if (validateObjectId(element)) {
        // replace path params of id with :id
        element = ":id";
      }
      if (newURL == "") {
        newURL = "/" + element;
      } else {
        newURL += "/" + element;
      }
    }
  }
  return newURL;
}

/**
 *
 * @param {*} id
 * @return {Boolean}
 */
function validateObjectId(id) {
  const checkObjectIdFormat = new RegExp("^[0-9a-fA-F]{24}$");
  return checkObjectIdFormat.test(id);
}
