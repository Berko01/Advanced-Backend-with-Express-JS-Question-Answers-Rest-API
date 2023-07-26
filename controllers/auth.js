const User = require("../models/User");
const CustomError = require("../helpers/error/CustomError");
const asyncErrorWrapper = require("express-async-handler");
const { sendJwtToClient } = require("../helpers/authorization/tokenHelpers.js");

const register = asyncErrorWrapper(async (req, res, next) => {
  //POST DATA

  const { name, email, password, role } = req.body;
  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  

  sendJwtToClient(user, res);
});

const getUser = (req, res, next) => {
  res.json({
    success: true,
    data: req.user.id,
    name: req.user.name
  });
};

module.exports = {
  register,
  getUser,
};
