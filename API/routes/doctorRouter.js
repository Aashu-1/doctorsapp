import express from "express";
import * as doctorController from "../controller/doctorController.js";

//------------------------------------------------------------------------------------------

const route = express.Router();

route.post("/save", doctorController.save);
route.post("/login", doctorController.login);
route.get("/fetch", doctorController.fetch);
route.patch("/update", doctorController.updateDoctor);
route.patch("/deleteappointment", doctorController.deleteAppointment);
route.delete("/delete", doctorController.deleteDoctor);

export default route;
