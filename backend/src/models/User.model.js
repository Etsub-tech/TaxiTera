import { Schema, model } from "mongoose";

const UserSchema = new Schema(
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

export default model("User", UserSchema);
