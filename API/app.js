import bodyParser from "body-parser";
import express from "express";
import userRouter from "./routes/userRouter.js";
import doctorRouter from "./routes/doctorRouter.js";
import fileupload from "express-fileupload";
import cors from "cors";
const app = express();

//ENCODING DATA IN THE BODY SECURELY
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//TO RESOLVE THE PROBLEM OF EMPTY OBJECT OR EXTRACT DATA FROM THE INCOMING REQUEST
app.use(fileupload());

//ADDED TO SOLVE THE PROBLEM OF CROSS ORIGIN
app.use(cors());

//REDIRECTING TO THE USER ROUTE
app.use("/user", userRouter);
app.use("/doctor", doctorRouter);

app.listen(3001);
console.log("server is activated at http://localhost:3001");
