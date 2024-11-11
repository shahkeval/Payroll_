const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const constants = require("../contants");

const UserSchema = new Schema(
    {
      userId: { type: String, required: true, unique: true },
      name: { type: String },
      email: { type: String, required: true, unique: true },
      status: {
        type: String,
        enum: constants.user.status,
        default: constants.userStatus.approved,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );
  
  const UserModel = mongoose.model("user", UserSchema);
  module.exports = UserModel;