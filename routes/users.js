const users = require("../data/users");

const router = require("express").Router();

router.get("/login", users.getLoginPage);
router.post("/login", users.login);
router.get("/signup", users.getSignUpPage);
router.post("/signup", users.signUp);

router.get("/getRecommendations", users.getRecommendations);
router.get("/:id/updatestatus",users.updatedStatus)
router.get("/:id", users.getUser);

module.exports = router;
