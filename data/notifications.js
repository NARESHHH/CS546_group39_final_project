const Notifications = require("../models/notifications");
const validator = require("../validators/notifications");
const ServerError = require("../shared/server-error");
const sendResponse = require("../shared/sendResponse");
const mongoose = require("mongoose");
const dumpNotifications =
  require("../API-Signature/getAllNotifications").responseBody;

module.exports = {
  getNotifications,
};

async function getNotifications(req, res, next) {
  try {
    const userId = req.user.id;
    const notifications = await Notifications.aggregate([
      { $match: { toUserId: new mongoose.Types.ObjectId(userId) } },
      {
        $lookup: {
          from: "users",
          let: { id: "$fromUserId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
            {
              $project: {
                id: "$_id",
                _id: 0,
                displayPicture: "$displayPicture",
                name: { $concat: ["$firstName", " ", "$lastName"] },
              },
            },
          ],
          as: "users",
        },
      },
      { $unwind: "$users" },
      {
        $project: {
          _id: 0,
          id: "$_id",
          fromUserId: "$fromUserId",
          fromUser: "$users.name",
          displayPicture: "$users.displayPicture",
          message: "$message",
        },
      },
    ]);
    return res.render("notifications/index", {
      // data: dumpNotifications.data,
      data: notifications,
      showHeaderSideFlag: true,
      notificationsFlag: true,
    });
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}
