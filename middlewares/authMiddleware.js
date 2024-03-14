import JWT, { decode } from "jsonwebtoken";
import userModel from "../models/userModel.js";

//Protected Routes token base
export const requireSignIn = async (req, res, next) => {
  try {
    const decode = JWT.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    req.user = decode;
    next();
  } catch (error) {
    console.log(error);
  }
};

//admin acceess
export const isAdmin = async (req, res, next) => {
  try {
    const user = await userModel.findById(req.user._id);
    if (user.role !== 1) {
      return res.send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
        req.user = decode;
      next();
    }
  } catch (error) {
    console.log(error);
    res.send({
      success: false,
      error,
      message: "Error in admin middelware",
    });
  }
};
