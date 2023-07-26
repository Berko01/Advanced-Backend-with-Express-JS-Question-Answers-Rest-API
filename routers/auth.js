const express = require("express");
const { register, getUser } = require("../controllers/auth");
const { getAccessToRoute } = require("../middlewares/authorization/auth");
// api/auth
// api/auth/register
const router = express.Router();

router.post("/register", register);
router.get("/profile", getAccessToRoute,getUser);
module.exports = router;
