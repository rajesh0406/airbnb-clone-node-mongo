import express from "express";
import {
  registerUser,
  loginUser,
  getUser,
  loginUserProfile,
  logoutUser,
} from "../controller/userController.js";
import authenticate from "../middleware/authenticate.js";

//Router Obj
const router = express.Router();

//***** Create routes */
//Register
router.post("/register", registerUser);

//Login
router.post("/login", loginUser);

//Get all user
router.get("/getUser", getUser);

//Get Login user profile
router.get("/profile", authenticate, loginUserProfile);

//Logout
router.post("/logout", logoutUser);

//Export
export default router;
