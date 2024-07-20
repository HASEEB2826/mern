import Listing from "../Model/listing.model.js";
import { errorHandler } from "../Utils/error.js";

export const CreateListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);
    res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const DeleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing)
    return next(errorHandler(401, "You can only Delete your own Listing"));
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only delete your own listing"));
  }
  try {
    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json("user has been deleted");
  } catch (error) {
    next(error);
  }
};

export const listingUpdate = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return next(errorHandler(401, "Listing not found!"));
  if (req.user.id !== listing.userRef) {
    return next(errorHandler(401, "You can only update only your own listing"));
  }
  try {
    const updatelist = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.status(200).json(updatelist);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(401, "listing not Found!"));
    }
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};

export const getlistings = async (req, res, next) => {
  try {
    const limit = req.query.limit || 9;
    const startIndex = req.query.startIndex || 0;

    let offer = req.query.offer;
    if (offer === undefined || "false") {
      offer = {
        $in: [true, false],
      };
    }
    let parking = req.query.parking;
    if (parking === undefined || "false") {
      parking = { $in: [true, false] };
    }
    let furnished = req.query.furnished;
    if (furnished === undefined || "false") {
      furnished = { $in: [true, false] };
    }

    let type = req.query.type;
    if (type === undefined || "all") {
      type = { $in: ["rent", "sale"] };
    }

    const searchTerm = req.query.searchTerm || "";
    const sort = req.query.sort || "created_At";
    const order = req.query.order || "desc";

    const listing = await Listing.find({
      name: { $regex: searchTerm, $options: "i" },
      offer,
      parking,
      furnished,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);
    res.status(200).json(listing);
  } catch (error) {
    next(error);
  }
};
