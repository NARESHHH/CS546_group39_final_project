const Users = require("../models/users");
const Notifications = require("../models/notifications");
const validator = require("../validators/users");
const ServerError = require("../shared/server-error");
const bcrypt = require("bcrypt");
const sendResponse = require("../shared/sendResponse");
const geoLocation = require("geoip-lite");
const mongoose = require("mongoose");
const isObjectId = mongoose.isValidObjectId;
const { default: xss } = require("xss");
const salt = 10;


module.exports = {
  getLoginPage,
  getSignUpPage,
  login,
  signUp,
  getRecommendations,
  getUser,
  editUser,
  updatedStatus,
  getCurrentUser,
  logout,
  getUsers,
  getAdmin,
  getMatchedUsers,
  getEditUserPage,
};

async function getMatchedUsers(req, res, next) {
  try {
    const userId = xss(req.user.id);
    const user = await Users.findOne({ _id: userId });

    const accpetedIds = user.acceptedUsers.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const matchedUsers = await Users.aggregate([
      {
        $match: {
          _id: { $in: accpetedIds },
          acceptedUsers: userId,
          isReported: false,
          isAdmin: false,
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: "$name",
          displayPicture: "$displayPicture",
        },
      },
    ]);
    return res.render("users/matchedUsers", {
      data: matchedUsers,
      showHeaderSideFlag: true,
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

async function getCurrentUser(req, res, next) {
  const userId = xss(req.user.id);

  const user = await Users.findOne({ _id: userId }).lean();

  let isAccepted = false;
  let isRejected = false;
  let isMatched = false;
  let isViewEdit = true;

  res.render("users/getCurrentUser", {
    showHeaderSideFlag: true,
    profileFlag: true,
    id: user._id,
    displayPicture: user.displayPicture,
    firstName: user.firstName,
    lastName: user.lastName,
    age: user.age,
    gender: user.gender,

    description: user.description,
    interests: user.interests,
    isAccepted: isAccepted,
    isRejected: isRejected,
    isMatched: isMatched,
    isViewEdit: isViewEdit,
    showHeaderSideFlag: true,

    img: req.session.user.img,
    name: req.session.user.name,
  });
}

async function getUsers(req, res, next) {
  const searchTerm = xss(req.query.searchTerm);

  const users = await Users.aggregate([
    {
      $match: {
        name: new RegExp(`.*${searchTerm}.*`, "i"),
        isReported: false,
        isAdmin: false,
      },
    },
    {
      $project: {
        id: "$_id",
        _id: 0,
        displayPicture: "$displayPicture",
        name: "$name",
      },
    },
  ]);

  return res.render("users/searchPage", {
    data: users,
    img: req.session.user.img,
    name: req.session.user.name,
    showHeaderSideFlag: true,
  });
}

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

async function getEditUserPage(req, res, next) {
  try {
    return res.render("users/editUser");
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

async function getAdmin(req, res, next) {
  try {
    const userId = xss(req.user.id);
    const user = await Users.findOne({ _id: userId }).lean();
    if (!user.isAdmin) return res.render("users/login");

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

    return res.render("users/adminMain", {
      //name: user.name,
      //img: user.displayPicture,
      notifications: notifications,
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

async function getUser(req, res, next) {
  try {
    const currentUserId = xss(req.user.id);

    const userId = req.params.id;
    if(!isObjectId(userId)) throw "userID is not a valid object id"
    let isAccepted = false;
    let isRejected = false;
    let isMatched = false;
    let isSameUser = false;
    let message = "";
    if (currentUserId == userId) isSameUser = true;
    const currentUser = await Users.findOne({ _id: currentUserId }).lean();
    const user = await Users.findOne({ _id: userId }).lean();
    if (!user) throw new ServerError(400, "User doesnot exists");
    if (user.isReported) throw new ServerError(400, "User is Reported");
    if (user.isAdmin) throw new ServerError(400, "User doesnot exists");

    if (
      currentUser.acceptedUsers.includes(userId) &&
      user.acceptedUsers.includes(currentUserId)
    ) {
      isMatched = true;
      
    } else if (
      currentUser.acceptedUsers.includes(userId) &&
      !user.acceptedUsers.includes(currentUserId)
    ) {
      isRejected = true;
    } else if (currentUser.rejectedUsers.includes(userId)) isAccepted = true;
    else {
      isAccepted = true;
      isRejected = true;
    }

    return res.render("users/userProfile", {
      showHeaderSideFlag: true,
      recommendationsFlag: true,
      id: user._id,
      displayPicture: user.displayPicture,
      firstName: user.firstName,
      lastName: user.lastName,
      age: user.age,
      gender: user.gender,
      message: message,
      description: user.description,
      interests: user.interests,
      isAccepted: isAccepted,
      isRejected: isRejected,
      isMatched: isMatched,
      isSameUser: isSameUser,
      showHeaderSideFlag: true,
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

async function editUser(req, res, next) {
  try {
    const requestBody = req.body;

    const userId = xss(req.user.id);

    const { error } = validator.validateEditUser(requestBody);
    if (error) {
      throw new ServerError(400, error.message);
    }

    const user = await Users.findOne({ _id: userId });

    if (!user)
      throw new ServerError(400, "User does not exists with given username");

    if (user.isAdmin)
      throw new ServerError(400, "User does not exists with given username");
    let password;

    if (requestBody.password) {
      password = await bcrypt.hash(requestBody.password, salt);
    }

    const coordinates = geoLocation.lookup(req.user.ip);

    const response = await Users.updateOne(
      { _id: userId },
      {
        $set: {
          firstName: requestBody.firstName,
          lastName: requestBody.lastName,
          name: `${requestBody.firstName} ${requestBody.lastName}`,
          username: user.username,
          password: password ? password : user.password,
          displayPicture: requestBody.displayPicture,
          gender: requestBody.gender,
          age: requestBody.age,
          interests: requestBody.interests,
          description: requestBody.description,
          preferences: requestBody.preferences,
          location: {
            type: "Point",
            coordinates: coordinates.ll,
          },
        },
      }
    );

    return res.json({ data: { url: `/users/${user._id}` } });
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

    if (user.isReported)
      throw new ServerError(
        400,
        "Your account is reported, Please contact system admin"
      );
    user.firstName = user.firstName.trim();
    user.lastName = user.lastName.trim();

    req.session.user = {
      id: user.id,
      name:
        user.firstName.substring(0, 1).toUpperCase() +
        user.firstName.substring(1) +
        " " +
        user.lastName.substring(0, 1).toUpperCase() +
        user.lastName.substring(1),
      img: user.displayPicture,
    };

    let page = "/users/getRecommendations";
    if (user.isAdmin) page = "/users/getAdmin";
    return res.json({ data: { url: page } });
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

async function logout(req, res, next) {
  try {
    req.session.destroy();
    return res.redirect("/users/login");
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
      name: `${requestBody.firstName} ${requestBody.lastName}`,
      username: username,
      password: password,
      displayPicture: requestBody.displayPicture,
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

    return res.json({ data: { url: "/users/login" } });
  } catch (error) {
    if (error instanceof ServerError) {
      next(error);
    }
    next(new ServerError(500, error.message));
  }
}

async function updatedStatus(req, res, next) {
  try {
    const userId = req.params.id;
    if(!Object.isValid(userId)) throw "userID not a valid object id"
    const currentUserId = req.user.id;
    const status = req.query.status;
    let page = req.query.page;
    const message = req.query.message;

    const currentUser = await Users.findOne({ _id: currentUserId });
    const user = await Users.findOne({ _id: userId });
    const admin = await Users.findOne({ isAdmin: true });

    const isMatched =
      currentUser.acceptedUsers.includes(userId) &&
      user.acceptedUsers.includes(currentUserId)
        ? true
        : false;

    switch (status) {
      case "accept":
        await Users.updateOne(
          { _id: currentUserId },
          { $push: { acceptedUsers: userId }, $pull: { rejectedUsers: userId } }
        );
        await Notifications.create({
          toUserId: userId,
          fromUserId: currentUserId,
          message: `You've been accepted by ${currentUser.firstName} ${currentUser.lastName}, Please click on their Profile to check them out!`,
        });
        break;
      case "reject":
        await Users.updateOne(
          { _id: currentUserId },
          { $pull: { acceptedUsers: userId }, $push: { rejectedUsers: userId } }
        );
        break;
      case "report":
        await Notifications.create({
          toUserId: admin.id,
          fromUserId: userId,
          message: message,
        });
        break;
      case "message":
        if (!isMatched) throw new ServerError(400, "Can't message");
        await Notifications.create({
          toUserId: userId,
          fromUserId: currentUser,
          message: message,
        });
        break;
      case "unmatch":
        await Users.updateOne(
          { _id: currentUserId },
          { $pull: { acceptedUsers: userId } }
        );
        break;
      case "block":
        if (!currentUser.isAdmin)
          throw new ServerError(
            400,
            "Users other than admin cannot block users"
          );
        await Users.updateOne({ _id: userId }, { $set: { isReported: true } });
        await Notifications.deleteOne({ fromUserId: userId });
        break;
      case "ignore":
        if (!currentUser.isAdmin)
          throw new ServerError(
            400,
            "Users other than admin cannot ignore users"
          );
        await Notifications.deleteOne({ fromUserId: userId });
        break;
      default:
        break;
    }
    switch (page) {
      case "getUser":
        page = `/users/${userId}`;
        break;

      case "getRecommendations":
        page = "/users/getRecommendations";
        break;

      case "notifications":
        page = "/notifications";

        break;

      default:
        break;
    }
    return res.redirect(page);
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
    let maxDistance = 1;

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
      isReported: false,
      isAdmin: false,
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
      { $limit: 1 },
    ]);

    let resUser;
    if (users.length > 0) {
      resUser = users[0];
    }
    const response = {
      data: resUser ? resUser : null,
      count: resUser ? 1 : 0,
      isAccepted: false,
      isRejected: false,
      isMatched: false,
      isSameUser: false,
    };
    return res.render("users/getRecommendations", {
      response,
      showHeaderSideFlag: true,
      recommendationsFlag: true,
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
