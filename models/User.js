const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Please provide a email."],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please provide a valid email",
    ],
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"],
  },
  password: {
    type: String,
    minlenght: [6, "Please provide a password with min lenght 6"],
    required: [true, "Please provide a password"],
    select: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  title: {
    type: String,
  },
  about: {
    type: String,
  },
  place: {
    type: String,
  },
  website: {
    type: String,
  },
  profile_image: {
    type: String,
    default: "default.jpg",
  },
  blocked: {
    type: Boolean,
    default: false,
  },
});


//User Schema Methods
UserSchema.methods.generateJwtFromUser = function () {
  const { JWT_SECRET_KEY, JWT_EXPIRE } = process.env;
  console.log("Generate jWT From USer fonc: " + process.env.JWT_SECRET_KEY);
  const payload = {
    id: this._id,
    name: this.name

    
  };

  const token = jwt.sign(payload,  process.env.JWT_SECRET_KEY, {
    expiresIn: JWT_EXPIRE,
  });
  return token;
};

//Pre Hooks
UserSchema.pre("save", function (next) {
  //Parola Değişme
  if (!this.isModified("password")) next();
  bcrypt.genSalt(10, (err, salt) => {
    if (err) next(err);

    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) next(err);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
