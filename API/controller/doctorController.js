import doctorSchemaModel from "../models/doctorModel.js";
import "../models/connection.js";
import jwt from "jsonwebtoken";
import rs from "randomstring";
import url from "url";
import sendMail from "./doctormailapi.js";
import path from "path";

//CREATING DIRECTORY FOR IMAGE PATH--------------------------------------------------------------------

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

//--------------------------------------------------------------------------------------------------------------------------------
//SAVE DOCTORS FUNCTIONALITY
export const save = async (req, res, next) => {
  const doctor = await doctorSchemaModel.find().sort({ _id: -1 });
  const id = doctor.length === 0 ? 1 : doctor[0]._id + 1;

  //GETTING FILE FROM INCOMING REQUEST'S BODY--------------------------------------------
  const file = req.files.profilepicture;
  //CREATING A UNIQUE FILENAME USING RANDOMSTRING FOR THE FOLDER WORKING------------------------------
  const filename = `${rs.generate(5)}-${Date.now()}-${file.name}`;

  //UPLOADING FILE TO THE GIVEN PATH------------------------------------------------------------------
  const uploadpath = path.join(
    __dirname,
    "../../UI/doctorsapp/public/assets/profile",
    filename
  );
  file.mv(uploadpath);

  //GIVEN IS THE DOCTOR OBJECT WHICH IS GONNA SAVED IN DB------------------------------------------------
  const doctorDetails = {
    _id: id,
    info: new Date(),
    status: 1,

    role: "doctor",
    profilepicture: filename,
    ...req.body,
  };
  try {
    doctorDetails.password = "." + rs.generate(9);
    const isDoctorSaved = await doctorSchemaModel.create(doctorDetails);
    if (isDoctorSaved) {
      res.status(200).json({ msg: "Details have been saved successfully" });
      sendMail(doctorDetails.email, doctorDetails.password);
    } else {
      res.status(400).json({ msg: "server error..." });
    }
  } catch (error) {
    res.status(404).json({
      msg: "Given credentials already exists",
    });
  }
};

//--------------------------------------------------------------------------------------------------------------------------------
//LOGIN DOCTORS FUNCTIONALITY
export const login = async (req, res, next) => {
  const condition_obj = { ...req.body, status: 1 };
  const doctor = await doctorSchemaModel.find(condition_obj);

  if (doctor.length !== 0) {
    const payload = { _id: doctor._id };
    const key = rs.generate();
    const token = jwt.sign(payload, key);
    res.status(200).json({
      token: token,
      msg: "logged in successfully",
      doctorDetails: doctor,
    });
  } else {
    res.status(400).json({ msg: "cannot login" });
  }
};

//--------------------------------------------------------------------------------------------------------------------------------
//FETCH DOCTORS FUNCTIONALITY
export const fetch = async (req, res, next) => {
  const condition_obj = url.parse(req.url, true).query;
  const doctor = await doctorSchemaModel.find(condition_obj);
  if (doctor.length !== 0) {
    res
      .status(200)
      .json({ msg: "Details fetched successfullly", doctorDetails: doctor });
  } else {
    res.status(404).json({
      msg: "Doctor doesn't exist, please talk to admin for the registration",
    });
  }
};

//--------------------------------------------------------------------------------------------------------------------------------
//UPDATE DOCTORS FUNCTIONALITY
export const updateDoctor = async (req, res, next) => {
  const condition_obj = req.body.condition_obj;

  const doctor = await doctorSchemaModel.find(condition_obj);
  if (doctor.length !== 0) {
    const isDoctorUpdated = await doctorSchemaModel.updateOne(condition_obj, {
      $set: {
        ...req.body.newdata_obj,
      },
    });

    //------------------------
    if (isDoctorUpdated) {
      res.status(200).json({
        msg: "Details have been updated successfully",
        doctorDetails: doctor,
      });
    } else {
      res.status(400).json({ msg: "Server error.............." });
    }
  } else {
    res.status(404).json({ msg: "Doctor not found" });
  }
};

//--------------------------------------------------------------------------------------------------------------------------------
//DELETE DOCTORS FUNCTIONALITY
export const deleteDoctor = async (req, res, next) => {
  const condition_obj = req.body.condition_obj;

  const doctor = await doctorSchemaModel.find(condition_obj);
  if (doctor.length !== 0) {
    const isDoctorDeleted = await doctorSchemaModel.deleteOne(condition_obj);

    //------------------------
    if (isDoctorDeleted) {
      res.status(200).json({
        msg: "Details have been deleted successfully",
      });
    } else {
      res.status(400).json({ msg: "Server error.............." });
    }
  } else {
    res.status(404).json({ msg: "Doctor not found" });
  }
};

//-----------------------------------------------------------------------------------------------------------------------------------
//FUCNTION FOR DELETING DOCTOR'S APPOINTMENT---

export const deleteAppointment = async (req, res, next) => {
  const condition_obj = req.body.condition_obj;

  const doctor = await doctorSchemaModel.find(condition_obj);

  if (doctor.length !== 0) {
    const isAppointmentDeleted = await doctorSchemaModel.updateOne(
      req.body.condition_obj,
      {
        $unset: {
          ...req.body.newdata_obj,
        },
      }
    );
    if (isAppointmentDeleted) {
      res
        .status(200)
        .json({ msg: "Appointment has been cleared successfully" });
    } else {
      res.status(400).json({ msg: "server error" });
    }
  } else {
    res.status(404).json({ msg: "cannot find..." });
  }
};
