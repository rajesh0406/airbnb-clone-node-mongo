import UserModel from "../model/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

//****************** USER REGISTRATION ******************/
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, mobile } = req.body;

    //Validation
    if (!name || !email || !password || !mobile) {
      return res.status(422).json({
        message: "Please Provide All Fields!",
      });
    }
    if (password.length < 6) {
      return res.status(422).json({
        message: "Password length should be greater than 6 character!",
      });
    }

    //Check existing user
    const existingUser = await UserModel.findOne({ email, name, mobile });
    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists!",
      });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //Create User
    const user = new UserModel(req.body);
    await user.save();

    //Create json web token
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
        mobile: user.mobile,
        name: user.name,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //Set cookie
    res.cookie("token", token);

    return res.status(201).json({
      message: "User Registered Successfully!",
      user,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in register user API!",
      error: err.message,
    });
  }
};

//****************** USER LOGIN ******************/
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(422).json({
        message: "Please provide all fields!",
      });
    }
    if (password.length < 6) {
      return res.status(422).json({
        message: "Password length should be greater than 6 character",
      });
    }

    //Check Registered user
    const registeredUser = await UserModel.findOne({ email });
    if (!registeredUser) {
      return res.status(404).json({
        message: "Invalid Credentials!",
      });
    }

    //Compare Password
    const comparePassword = await bcrypt.compare(
      password,
      registeredUser.password
    );
    if (!comparePassword) {
      return res.status(400).json({
        message: "Incorrect Password, Please check again!",
      });
    }

    //Create json web token
    const token = jwt.sign(
      {
        email: registeredUser.email,
        userId: registeredUser._id,
        name: registeredUser.user,
        mobile: registeredUser.mobile,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    //Set cookie
    res.cookie("token", token);

    //Login Success
    return res.status(200).json({
      message: "Login Success!",
      registeredUser,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in Login user API!",
      error: err.message,
    });
  }
};

//****************** GET ALL USER ******************/
export const getUser = async (req, res, next) => {
  try {
    const allUser = await UserModel.find();
    if (!allUser) {
      return res.status(500).json({
        message: "Unexpected Error Occured!",
      });
    }

    return res.status(200).json({
      message: "Success",
      data: {
        totalUser: allUser.length,
        allUser,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Error in Login user API!",
      error: err.message,
    });
  }
};

//************ GET LOGIN USER PROFILE DETAILS **************/
export const loginUserProfile = async (req, res, next) => {
  try {
    const user = req.user;

    if (!!user) {
      //Get user data
      const userDoc = await UserModel.findById(user.userId);
      return res.json(userDoc);
    }
    return res.status(404).json({
      message: "Internal Server Error!",
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};

//************ LOGOUT USER **************/
export const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token", "").json(true);
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      error: err.message,
    });
  }
};
