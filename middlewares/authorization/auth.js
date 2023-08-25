const CustomError = require("../../helpers/error/CustomError");
const Question = require("../../models/Question");
const jwt = require("jsonwebtoken");
const Answer = require("../../models/Answer");
const {
  isTokenIncluded,
  getAccessTokenFromHeader,
} = require("../../helpers/authorization/tokenHelpers.js");
const asyncErrorWrapper = require("express-async-handler");
const User = require("../../models/User");

const getAccessToRoute = (req, res, next) => {
  if (!isTokenIncluded(req)) {
    return next(
      new CustomError("You are not authorized to access this route.", 401)
    );
  }

  const accessToken = getAccessTokenFromHeader(req);
  const { JWT_SECRET_KEY } = process.env;
  console.log("Get Access to Route " + JWT_SECRET_KEY);
  jwt.verify(accessToken, JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return next(
        new CustomError("You are not authorized to access this route.", 401)
      );
    }
    req.user = {
      id: decoded.id,
      name: decoded.name,
    };
    next();
  });
};

const getAdminAccess = asyncErrorWrapper(async (req, res, next) => {
  const { id } = req.user;

  const user = await User.findById(id);

  if (user.role !== "admin") {
    return next(new CustomError("Only admins can access this route.", 403));
  }
  next();
});

getQuestionOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const questionId = req.params.id;

  const question = await Question.findById(questionId);

  if (question.user != userId) {
    return next(new CustomError("Only owner can handle this operation.", 403)); //forbidden
  }

  return next();
});

getAnswerOwnerAccess = asyncErrorWrapper(async (req, res, next) => {
  const userId = req.user.id;
  const answerId = req.params.answer_id;

  const answer = await Answer.findById(answerId);

  if (answer.user != userId) {
    return next(new CustomError("Only owner can handle this operation.", 403)); //forbidden
  }

  next();
});

module.exports = {
  getAccessToRoute,
  getAdminAccess,
  getQuestionOwnerAccess,
  getAnswerOwnerAccess,
};
