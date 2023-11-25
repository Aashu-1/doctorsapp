import express from "express";
import * as userController from "../controller/userController.js";

const route = express.Router();

route.post("/save", userController.save);
route.post("/login", userController.login);
route.get("/fetch", userController.fetch);
route.patch("/update", userController.updateUser);
route.delete("/delete", userController.deleteUser);
route.post("/otpverification", userController.otpVerify);

export default route;
