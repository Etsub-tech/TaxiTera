const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    securityQuestions: [
      {
        questionId: {
          type: Number,
          required: true
        },
        answer: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
