const Notifications = require("../models/notifications");
const validator = require("../validators/notifications");
const ServerError = require("../shared/server-error");
const sendResponse = require("../shared/sendResponse");

module.exports = {
  getNotifications,
};

async function getNotifications(req, res, next) {
  try {
    return res.render("users/login");
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}
