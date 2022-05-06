const Users = require("../models/users");
const validator = require("../validators/users");
const ServerError = require("../shared/server-error");
const bcrypt = require("bcrypt");
const sendResponse = require("../shared/sendResponse");
const geoLocation = require("geoip-lite");
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

    const user = await Users.findOne({
      username: username.toLowerCase(),
    });

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

    req.session.user = {
      id: user.id,
    };

    return res.redirect("/users/getRecommendations?maxDistance=1");
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

    const coordinates = geoLocation.lookup(req.user.ip);

    const response = await Users.create({
      firstName: requestBody.firstName,
      lastName: requestBody.lastName,
      username: username,
      password: password,
      phone: requestBody.phone,
      gender: requestBody.gender,
      age: requestBody.age,
      interests: requestBody.interests,
      description: requestBody.description,
      preferences: requestBody.preferences,
      location: {
        type: "Point",
        coordinates: coordinates.ll,
      },
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

    if (isNaN(maxDistance)) throw new ServerError(400, "Invalid max distance");

    maxDistance = Number(maxDistance);

    const user = await Users.findOne({ _id: userId }).lean();

    const interestsQuery = {
      $text: { $search: user.interests },
    };

    const locationQuery = {
      location: {
        $near: {
          $geometry: user.location,
          $maxDistance: maxDistance,
        },
      },
    };

    const acceptedUsers = user.acceptedUsers;
    const rejectedUsers = user.rejectedUsers;

    const invalidIds = [user._id, ...acceptedUsers, ...rejectedUsers];

    const preferencesQuery = {
      _id: { $nin: invalidIds },
      gender: { $in: user.preferences.genders },
      "preferences.genders": user.gender,
      age: { $gte: user.preferences.age.min, $lte: user.preferences.age.max },
    };

    let userIds = await Users.find(preferencesQuery).distinct("_id");

    let luserIds = await Users.find(locationQuery, { _id: 1 }).lean();

    luserIds = userIds.map((user) => user._id);

    userIds = await Users.find({
      _id: { $in: [...userIds, ...luserIds] },
    }).distinct("_id");

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
          score: { $meta: "textScore" },
        },
      },
      { $sort: { score: -1 } },
    ]);

    return res.send({ data: users });
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

