const notifications = require("../data/notifications");

const router = require("express").Router();

router.post("/message", notifications.sendMessage);
router.get("/", notifications.getNotifications);

module.exports = router;
