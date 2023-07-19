const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the User name"],
    },
    email: {
      type: String,
      required: [true, "Please add the contact email address"],
      unique: [true, "Email address is already taked"],
    },
    password: {
      type: String,
      required: [true, "Please add the contact password"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
