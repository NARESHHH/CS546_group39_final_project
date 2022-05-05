const Users = require("../models/users");
const validator = require("../validators/users");
const ServerError = require("../shared/server-error");
const bcrypt = require("bcrypt");
const sendResponse = require("../shared/sendResponse");
const salt = 10;

module.exports = {
  getLoginPage,
  getSignUpPage,
  login,
  signUp,
  getRecommendations,
};

async function getLoginPage(req, res, next) {
  try {
    return res.render("users/login");
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

async function getSignUpPage(req, res, next) {
  try {
    return res.render("users/signup");
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

async function login(req, res, next) {
  try {
    const reqBody = req.body;

    const { error } = validator.validateUserLogin(reqBody);
    if (error) {
      throw new ServerError(400, error.message);
    }

    const username = reqBody.username;
    const password = reqBody.password;

    const user = await Users.findOne({ username: username.toLowerCase() });

    if (!user) {
      throw new ServerError(
        400,
        `User does not exists with given username ${username}`
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new ServerError(
        400,
        "Password does not match, Please Re-enter password"
      );
    }

    req.session.user = user.id;

    return res.redirect("/users/getRecommendations");
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

async function signUp(req, res, next) {
  try {
    const requestBody = req.body;

    const { error } = validator.validateUserSignUp(requestBody);
    if (error) {
      throw new ServerError(400, error.message);
    }

    const username = requestBody.username.toLowerCase();

    const user = await Users.findOne({ username: username });

    if (user)
      throw new ServerError(400, "User already exists with given username");

    const password = await bcrypt.hash(requestBody.password, salt);

    await Users.create({
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      username: username,
      password: password,
    });

    return res.send("user created successfully");
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

async function getRecommendations(req, res, next) {
  try {
    const userId = req.user.id;
    let maxDistance = req.query.maxDistance;

    if (!isNaN(maxDistance)) throw new ServerError(400, "Invalid max distance");

    maxDistance = Number(maxDistance);

    const user = await Users.find({ _id: userId }).lean();

    const interestsQuery = {
      $text: { $search: `\"${user.interestsString}\"` },
    };

    const locationQuery = {
      location: {
        $near: {
          $geometry: user.location,
          $maxDistance: maxDistance,
        },
      },
    };

    const invalidIds = [user._id, ...user.acceptedUsers, ...user.rejectedUsers];

    const preferencesQuery = {
      _id: { $nin: invalidIds },
      gender: { $in: user.preferences.genders },
      "preferences.genders": user.gender,
      age: { $gte: user.preferences.minAge, $lte: user.preferences.maxAge },
    };

    let userIds = await Users.find(preferencesQuery).distinct("_id");

    userIds = await Users.aggregate([
      { $match: locationQuery },
      { $match: { _id: { $in: userIds } } },
      { $project: { id: "$_id", _id: 0 } },
    ]);

    userIds = userIds.map((user) => user.id);

    const users = await Users.aggregate([
      { $match: interestsQuery },
      { $match: { _id: { $in: userIds } } },
      {
        $project: {
          _id: 0,
          id: "$_id",
          displayPicture: "$displayPicture",
          firstName: "$firstName",
          lastName: "$lastName",
          age: "$age",
          gender: "$gender",
          description: "$description",
          interests: "$interests",
        },
      },
    ]);

    return sendResponse(req, res, next, 200, users);
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}
