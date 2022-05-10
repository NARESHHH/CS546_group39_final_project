const Notifications = require("../models/notifications");
const Users = require("../models/users");
const validator = require("../validators/notifications");
const ServerError = require("../shared/server-error");
const sendResponse = require("../shared/sendResponse");
const mongoose = require("mongoose");
const dumpNotifications =
  require("../API-Signature/getAllNotifications").responseBody;

module.exports = {
  getNotifications,
  sendMessage,
  reportUser,
};

async function sendMessage(req, res, next) {
  try {
    const userId = req.user.id;
    const toUserId = req.body.toUserId;
    const message = req.body.message;
    await Notifications.create({
      fromUserId: userId,
      toUserId: toUserId,
      message: message,
    });
    return res.json({ data: { url: `/users/${userId}` } });
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

async function reportUser(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await Users.findOne({ isAdmin: true });
    const toUserId = user._id;
    const fromUserId = req.body.toUserId;
    const message = req.body.message;
    await Notifications.create({
      fromUserId: fromUserId,
      toUserId: toUserId,
      message: message,
    });
    return res.json({ data: { url: `/users/${userId}` } });
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

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
      img: req.session.user.img,
      name: req.session.user.name,
    });
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}
