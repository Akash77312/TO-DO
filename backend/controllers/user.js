import { response } from "express";
import { User } from "../models/user.js";
import bcrypt, { compare } from "bcrypt";
import { sendCookie } from "../utils/features.js";
import ErrorHandler from "../middlewares/error.js";

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");

    if (!user) return next(new ErrorHandler("Invalid Email Or Password", 400));
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return next(new ErrorHandler("Invalid Email Or Password", 400));
    sendCookie(user, res, `Welcome Back , ${user.name}`, 201);
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res,next) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user) return next(new ErrorHandler("User already exist", 404));

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({ name, email, password: hashedPassword });

    sendCookie(user, res, "Registered User", 201);
  } catch (error) {
    next(error);
  }
};

export const getMyProfile = (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};
export const logout = (req, res) => {
  res.status(200).cookie("token", "").json({
    success: true,
    user: req.user,
    sameSite: process.env.NODE_ENV === "Development" ? "lex" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
  });
};
