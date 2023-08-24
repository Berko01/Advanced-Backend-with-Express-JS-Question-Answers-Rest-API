const express = require("express");
const {
  register,
  getUser,
  login,
  logout,
  imageUpload,
  forgotPassword,
  resetPassword,
  editDetails
} = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
const {
  profileImageUpload,
} = require("../middlewares/libaries/profileImageUpload");
// api/auth
// api/auth/register
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", getAccessToRoute, getUser);
router.get("/logout", getAccessToRoute, logout);
router.post("/forgotpassword",forgotPassword);
router.put("/edit", getAccessToRoute, editDetails)
router.post(
  "/upload",
  [getAccessToRoute, profileImageUpload.single("profile_image")],
  imageUpload
);
router.put("/resetpassword", resetPassword)
module.exports = router;
