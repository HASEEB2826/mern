import express from "express";
import { VerifyToken } from "../Utils/verifyToken.js";
import {
    getUser,
  getuserListing,
  userDelete,
  userUpdate,
} from "../Controller/user.controller.js";

const router = express.Router();

router.post("/update/:id", VerifyToken, userUpdate);
router.delete("/delete/:id", VerifyToken, userDelete);
router.get("/getlisting/:id", VerifyToken, getuserListing);
router.get("/getuser/:id", getUser);

export default router;
