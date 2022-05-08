const notifications = require("../data/notifications");

const router = require("express").Router();

router.get("/", notifications.getNotifications);

module.exports = router;
