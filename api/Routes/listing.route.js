import express from "express";
import { VerifyToken } from "../Utils/verifyToken.js";
import {
  CreateListing,
  DeleteListing,
  getListing,
  getlistings,
  listingUpdate,
} from "../Controller/listing.controller.js";

const router = express.Router();

router.post("/create", VerifyToken, CreateListing);
router.delete("/delete/:id", VerifyToken, DeleteListing);
router.post("/update/:id", VerifyToken, listingUpdate);
router.get("/getlisting/:id", getListing);
router.get("/getlistings", getlistings);

export default router;
