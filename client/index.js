import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import path from "path";
const app = express();
const PORT = 3000;
dotenv.config();
app.use(express.json());
app.use(cookieParser());

//Routes Imports
import authRouter from "./Routes/auth.routes.js";
import userRouter from "./Routes/user.route.js";
import listingRouter from "./Routes/listing.route.js";
//Routes Imports

//Routes Using
app.use("/api/listing", listingRouter);
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});

mongoose.connect("mongodb://127.0.0.1:27017/NewRealEstate").then(() => {
  console.log("Connected Db to the mongoDb");
});

const _dirname = path.resolve();

app.get("/", (req, res) => {
  res.json({
    message: "application is connected",
  });
});

app.listen(PORT, () => {
  console.log(`connected to Port No ${PORT}`);
});

app.use((err, req, res, next) => {
  const Statuscode = err.Statuscode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(Statuscode).json({
    success: false,
    Statuscode,
    message,
  });
});
