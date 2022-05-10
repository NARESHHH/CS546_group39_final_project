const users = require("../data/users");

const router = require("express").Router();

router.get("/", users.getUsers);
router.get("/login", users.getLoginPage);
router.post("/login", users.login);
router.get("/signup", users.getSignUpPage);
router.post("/signup", users.signUp);
router.get("/getCurrentUser", users.getCurrentUser);
router.get("/getRecommendations", users.getRecommendations);
router.get("/:id/updateStatus", users.updatedStatus);
router.get("/logout", users.logout);
router.get("/getAdmin", users.getAdmin);
router.get("/:id", users.getUser);

module.exports = router;
