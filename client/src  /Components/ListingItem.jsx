import React from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

export const ListingItem = ({ listing }) => {
  return (
    <div className="overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow w-full sm:w-[330px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.ImageUrl[0] ||
            "https://fjwp.s3.amazonaws.com/blog/wp-content/uploads/2022/12/07082032/10-Companies-That-Hire-for-Remote-Real-Estate-Jobs.jpg"
          }
          className="h-[320px] sm:h[220px] w-full object-cover hover:scale-105 transition-scale duration-300 "
          alt=""
        />
        <div className="flex flex-col gap-4 p-3">
          <p className="text-lg text-slate-600 font-semibold truncate">
            {listing.name}
          </p>
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt />
            <p className="truncate text-slate-800 w-full">{listing.address}</p>
          </div>
          <p className="line-clamp-2 text-sm text-gray-500">
            {listing.description}
          </p>
          <p className="font-semibold text-slate-500 mt-2">
            {" "}
            $ {listing.offer
              ? listing.discountPrice
              : listing.regularPrice}{" "}
            {listing.type === "rent" && "/ Months"}
          </p>
          <div className="flex gap-2 items-center">
            <div>
              {listing.bedroom > 1
                ? `${listing.bedroom} beds`
                : `${listing.bedroom} bed`}
            </div>
            <div>
              {listing.bathroom > 1
                ? `${listing.bathroom} baths`
                : `${listing.bathroom} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};
