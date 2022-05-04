const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valid!");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error(
          "Password should be 8 characters long. contain 1 lowercase and 1 uppercase character "
        );
      }
    },
  },
  dob: {
    type: Date,
    required: true,
    validate(value) {
      const getPastFiveYears = new Date().getFullYear() - 5;
      if (
        !validator.isDate(value) ||
        !validator.isBefore(getPastFiveYears.toString())
      ) {
        throw new Error(
          "You did not enter a validate date, you should at least be 5 years old."
        );
      }
    },
  },
  favorites: [{ type: Schema.Types.ObjectId, ref: "House" }],
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
  admin: {
    type: Boolean,
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedAt: {
    type: Date,
    default: Date.now(),
  },
  lastLogin: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.virtual("houses", {
  ref: "House",
  localField: "_id",
  foreignField: "author",
});

userSchema.methods.toJSON = function () {
  const user = this;
  const userData = user.toObject();

  delete userData.password;
  delete userData.tokens;

  return userData;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user) {
    throw new Error("Check your email");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Unable to login, check your password");
  }
  return user;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "thisismynewtoken");
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
