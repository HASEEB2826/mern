import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import { Link } from "react-router-dom";
import { ListingItem } from "../Components/ListingItem";

export const Home = () => {
  SwiperCore.use([Navigation]);
  const [offerlistings, setOfferListings] = useState([]);
  const [rentlistings, setRentListings] = useState([]);
  const [salelistings, setSaleListings] = useState([]);

  useEffect(() => {
    const fetchofferlistings = async () => {
      try {
        const res = await fetch(`/api/listing/getlistings?offer=true&limit=4`);
        const data = await res.json();
        setOfferListings(data);
        fetchrentlisting();

        // console.log(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchrentlisting = async () => {
      try {
        const res = await fetch("/api/listing/getlistings?rent=true&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchsalelisting();
      } catch (error) {}
    };

    const fetchsalelisting = async () => {
      try {
        const res = await fetch("/api/listing/getlistings?sale=true&limit=4");
        const data = await res.json();
        console.log(data);
        setSaleListings(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchofferlistings();
  }, []);

  return (
    <div>
      {/* Home */}
      <div className="flex flex-col gap-6 p-7 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 text-3xl font-bold md:text-6xl">
          find your next <span className="text-slate-500">perfect</span> place
          with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Royal vilas is the best place to find your next perfect place to your
          home, home is need thing which every one wants
          <br />
          we have alot of varity in house please check our websites
        </div>
        <Link
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
          to={"/search"}
        >
          lets get started
        </Link>
      </div>

      {/* Swiper  */}
      <Swiper navigation>
        {offerlistings &&
          offerlistings.length > 0 &&
          offerlistings.map((listing) => (
            <SwiperSlide>
              <div
                key={listing._id}
                className="h-[500px]"
                style={{
                  background: `url(${listing.ImageUrl}) no-repeat center`,
                  backgroundSize: "cover",
                }}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>
      {/* listing results for offer sale and rent  */}

      <div className="flex flex-col max-w-6xl mx-auto p-3 gap-8 my-10">
        {offerlistings && offerlistings.length > 0 && (
          <div>
            <div>
              <h2 className="text-xl font-semibold text-slate-600">
                Recent Offers
              </h2>
              <Link
                className="text-sm text-blue-800 hover:underline"
                to={"/search?offer=true"}
              >
                show more listing
              </Link>
            </div>
            <div className="flex gap-4 flex-col sm:flex-row">
              {offerlistings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {rentlistings && rentlistings.length > 0 && (
          <div>
            <div>
              <h1 className="text-xl font-semibold text-slate-800">
                Rent Listings
              </h1>
              <Link
                className="text-blue-800 text-sm hover:underline"
                to={"/search?rent=true"}
              >
                show more listing
              </Link>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              {rentlistings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
        {salelistings && salelistings.length > 0 && (
          <div>
            <div>
              <h1 className="text-xl text-slate-700 font-semibold">
                Sale Listing
              </h1>
              <Link
                className="text-blue-800 hover:underline"
                to={"/search?sale=true"}
              >
                show more listing
              </Link>
            </div>
            <div className="flex gap-4">
              {salelistings.map((listing) => (
                <ListingItem key={listing._id} listing={listing} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
