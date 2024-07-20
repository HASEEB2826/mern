import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { Contact } from "../Components/Contact";

export const Listing = () => {
  SwiperCore.use([Navigation]);
  const { currentUser } = useSelector((state) => state.user);
  const param = useParams();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState(null);
  const [copy, setCopy] = useState(false);
  const [contact, setContact] = useState(false);

  useEffect(() => {
    const fetchlistingdata = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listing/getlisting/${param.listingId}`);
        const data = await res.json();
        if (data.success === false) {
          console.log(data.message);
          return;
        }
        setListing(data);
        console.log(data);
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchlistingdata();
  }, []);

  return (
    <main>
      {loading && (
        <p className="flex justify-center items-center h-[500px] text-4xl p-3 ">
          Fetching data Loading....
        </p>
      )}
      {listing && !loading && (
        <>
          <Swiper navigation>
            {listing.ImageUrl.length > 0 &&
              listing.ImageUrl.map((url) => (
                <SwiperSlide
                  className="hover:scale-105 transition-scale duration-500"
                  key={url}
                >
                  <div
                    className="h-[550px]"
                    style={{
                      background: `url(${url}) no-repeat center`,
                      backgroundSize: "cover",
                    }}
                  ></div>
                </SwiperSlide>
              ))}
          </Swiper>
          <div
            className="bg-white p-5 rounded-full fixed z-10 top-[23%] right-[5%] hover:opacity-50 cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopy(true);
              setInterval(() => {
                setCopy(false);
              }, 3000);
            }}
          >
            <FaShare />
          </div>
          {copy && (
            <p className="fixed z-10 top-[35%] right-[4%] bg-white p-4 rounded-lg">
              Link Copied !
            </p>
          )}
          <div className="flex flex-col p-3 max-w-4xl  mx-auto gap-4">
            <p className="text-xl text-slate-800">
              {listing.name} - ${" "}
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-us")
                : listing.regularPrice.toLocaleString("en-us")}
            </p>
            <p className="flex items-center gap-2">
              <FaMapMarkerAlt />
              {listing.address}
            </p>
            <div className="flex gap-3">
              <p className="p-3 text-white text-center rounded-lg bg-red-800 w-[200px]">
                {listing.type === "rent" ? "rent" : "sale"}
              </p>
              {listing.offer && (
                <p className="p-3 text-white text-center rounded-lg bg-teal-800 w-[200px]">
                  $ {+listing.regularPrice - +listing.discountPrice}
                </p>
              )}
            </div>
            <p className="font-bold">
              Discription:
              <span className="ml-2 text-slate-700">{listing.description}</span>
            </p>
            <ul className="flex gap-4 flex-wrap">
              <li className="flex items-center gap-3">
                <FaBed style={{ fontSize: "20px" }} />
                {listing.bedroom > 1
                  ? `${listing.bedroom} beds`
                  : `${listing.bedroom} bed `}
              </li>
              <li className="flex items-center gap-3">
                <FaBath style={{ fontSize: "20px" }} />
                {listing.bathroom > 1
                  ? `${listing.bathroom} baths`
                  : `${listing.bathroom} bath `}
              </li>
              <li className="flex items-center gap-3">
                <FaParking style={{ fontSize: "20px" }} />
                {listing.parking ? "parking" : "Not Present"}
              </li>
              <li className="flex items-center gap-3">
                <FaChair style={{ fontSize: "20px" }} />
                {listing.furnished ? "Furnished" : "Not Present"}
              </li>
            </ul>
            {currentUser._id !== listing.userRef && !contact && (
              <button
                onClick={() => setContact(true)}
                className="p-3 text-white bg-slate-900 rounded-lg"
              >
                Contact LandLord
              </button>
            )}
            {contact && <Contact listing={listing} />}
          </div>
        </>
      )}
    </main>
  );
};
