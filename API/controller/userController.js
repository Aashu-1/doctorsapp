import userSchemaModel from "../models/userModel.js";
import "../models/connection.js";
import url from "url";
import jwt from "jsonwebtoken";
import rs from "randomstring";
import sendMail from "./mailapi.js";
import sendOtpMail from "./otpmailapi.js";

//---------------------------------------------------------------------------------------------------
//FOR ADDING THE DATA INTO THE DB
export const save = async (req, res, next) => {
  const user = await userSchemaModel.find().sort({ _id: -1 });
  const id = user.length === 0 ? 1 : user[0]._id + 1;

  const userObj = {
    _id: id,
    status: 1,
    info: new Date(),
    role: "user",
    ...req.body,
  };

  try {
    const isUserSaved = await userSchemaModel.create(userObj);
    if (isUserSaved) {
      //SENDING MAIL TO USER

      sendMail(isUserSaved.email, isUserSaved.password);

      res.status(200).json({
        status: true,
        msg: "Your details has been added successfully",
      });
    } else {
      res.status(400).json({ status: false, msg: "server error......" });
    }
  } catch (error) {
    res.status(400).json({ status: false, msg: "Given data already exists.." });
  }
};

//-----------------------------------------------------------------------------------------------------
//FUNCTION FOR LOGIN USER WITH UNIQUE KEYS
export const login = async (req, res, next) => {
  const condition_obj = { ...req.body, status: 1 };
  const user = await userSchemaModel.find(condition_obj);
  if (user.length !== 0) {
    var payload = { _id: user._id };
    var key = rs.generate();
    var token = jwt.sign(payload, key);
    res.status(200).json({
      status: true,
      msg: "Logged in successfully...",
      token: token,
      userDetails: user,
    });
  } else {
    res.status(404).json({ msg: "Cannot login..." });
  }
};

//-----------------------------------------------------------------------------------------------------
//FUNCTION FOR FETCHING USER DETAILS FROM THE DB
export const fetch = async (req, res, next) => {
  const condition = url.parse(req.url, true).query;
  const user = await userSchemaModel.find(condition);
  if (user.length !== 0) {
    res.status(200).json({
      status: true,
      msg: "Details has been fetched successfully",
      userDetails: user,
    });
  } else {
    res.status(404).json({
      status: false,
      msg: "No such user exists. please register yourself",
    });
  }
};

//-----------------------------------------------------------------------------------------------------
//FUNCTION FOR UPDATING USER DATA IN DB
export const updateUser = async (req, res, next) => {
  console.log(req.body.condition_obj);
  const user = await userSchemaModel.find(req.body.condition_obj);
  if (user.length !== 0) {
    const isUserUpdated = await userSchemaModel.updateOne(
      req.body.condition_obj,
      { $set: req.body.newdata_obj }
    );

    if (isUserUpdated) {
      res.status(200).json({
        status: true,
        msg: "Details have been updated successfully",
        userDetails: user,
      });
    } else {
      res.status(400).json({ status: false, msg: "server error......" });
    }
  } else {
    res.status(404).json({
      status: false,
      msg: "No such user exists. please register yourself",
    });
  }
};

//-----------------------------------------------------------------------------------------------------
//FOR DELETING USER DATA FROM THE DB
export const deleteUser = async (req, res, next) => {
  console.log(req.body);
  const condition_obj = req.body;
  const user = await userSchemaModel.find(condition_obj);
  if (user.length !== 0) {
    const isUserDeleted = await userSchemaModel.deleteOne(condition_obj);
    if (isUserDeleted) {
      res.status(200).json({
        status: true,
        msg: "UserDetails have been deleted successfully",
      });
    } else {
      res.status(400).json({ status: false, msg: "server error......" });
    }
  } else {
    res.status(404).json({
      status: false,
      msg: "No such user exists...",
    });
  }
};

//----------------------------------------------------------
//FOR SENDING OTP EMAIL

export const otpVerify = async (req, res, next) => {
  const otp = {
    ...req.body,
  };
  console.log(req.body);

  try {
    const isOtpSent = await sendOtpMail(otp.email, otp.otp);
    if (isOtpSent) {
      res.status(200).json({ msg: "otp sent successfully" });
    }
  } catch (error) {
    res.status(400).json({ error });
  }
};
