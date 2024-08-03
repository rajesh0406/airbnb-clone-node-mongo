import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is Required!"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Email is Required!"],
    unique: true,
    validate: validator.isEmail,
  },
  password: {
    type: String,
    required: [true, "Password is Required!"],
  },
  profileImage: {
    type: String,
  },
  mobile: { type: String, required: true, unique: true },
  isHost: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("User", userSchema);
