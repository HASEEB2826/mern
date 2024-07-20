import express from "express";
import { Google, Signin, signout, Signup } from "../Controller/auth.controller.js";
const router = express.Router();

router.post("/signup", Signup);
router.post("/signin", Signin);
router.get("/signout", signout);
router.post("/google", Google);

export default router;
  