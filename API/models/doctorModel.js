import mongoose from "mongoose";
import mongooseUniqueValidator from "mongoose-unique-validator";

const doctorSchema = mongoose.Schema({
  _id: Number,
  info: String,
  status: Number,
  role: String,
  name: {
    type: String,
    lowercase: true,
    required: [true, "name is required"],
  },
  degree: {
    type: String,
    lowercase: true,
    required: [true, "degree is required"],
  },
  profilepicture: String,
  specialization: {
    type: String,
    lowercase: true,
    required: [true, "spcialization is required"],
  },
  residentialAdd: {
    type: String,
    lowercase: true,
    required: [true, "residential add is required"],
  },
  clinicAdd: {
    type: String,
    lowercase: true,
    required: [true, "clinical address  is required"],
  },
  stayTime: {
    type: String,
    lowercase: true,
    required: [true, "stay and timing  is required"],
  },
  personalcontact: {
    type: Number,
    lowercase: true,
    maxlength: 10,
  },
  cliniccontact: {
    type: Number,
    lowercase: true,
    maxlength: 10,
    required: [true, "clinic contact is required"],
  },
  experience: {
    type: Number,
    lowercase: true,
    required: [true, "experience is required"],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: [true, "email is required"],
  },
  password: {
    type: String,
    lowercase: true,
    required: [true, "password is required"],
  },
  appointmentdetails: {
    type: Array,
    lowercase: true,
    required: [true, "appointment is required"],
  },
  appointmentnumber: {
    type: Number,
    maxlength: 12,
  },
});

doctorSchema.plugin(mongooseUniqueValidator);
const doctorSchemaModel = mongoose.model("doctors_details", doctorSchema);
export default doctorSchemaModel;
