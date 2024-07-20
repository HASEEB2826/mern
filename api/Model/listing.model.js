import mongoose from "mongoose";

const userListing = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    type: { type: String, required: true },
    furnished: { type: Boolean, required: true },
    parking: { type: Boolean, required: true },
    offer: { type: Boolean, required: true },
    bedroom: { type: Number, required: true },
    bathroom: { type: Number, required: true },
    regularPrice: { type: Number, required: true },
    discountPrice: { type: Number, required: true },
    ImageUrl: { type: Array, required: true },
    userRef: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model("Listing", userListing);

export default Listing;
