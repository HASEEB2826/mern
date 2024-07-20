import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ListingItem } from "../Components/ListingItem";

export const Search = () => {
  const navigate = useNavigate();
  const [showmoreListing, setShowmoreListing] = useState(false);
  const [listing, setListing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    furnished: false,
    offer: false,
    parking: false,
    sort: "created_at",
    order: "desc",
  });

  console.log(sidebardata);

  const onChanges = (e) => {
    const { id } = e.target;
    if (id === "all" || id === "sale" || id === "rent") {
      setSidebardata({
        ...sidebardata,
        type: e.target.id,
      });
    }
    if (id === "parking" || id === "offer" || id === "furnished") {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({
        ...sidebardata,
        sort,
        order,
      });
    }
    if (id === "searchTerm") {
      setSidebardata({
        ...sidebardata,
        searchTerm: e.target.value,
      });
    }
  };

  const handelSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermfromurl = urlParams.get("searchTerm");
    const typefromurl = urlParams.get("type");
    const parkingfromurl = urlParams.get("parking");
    const furnishedfromurl = urlParams.get("furnished");
    const offerfromurl = urlParams.get("offer");
    const sortfromurl = urlParams.get("sort");
    const orderfromurl = urlParams.get("order");
    if (
      searchTermfromurl ||
      typefromurl ||
      parkingfromurl ||
      furnishedfromurl ||
      offerfromurl ||
      sortfromurl ||
      orderfromurl
    ) {
      setSidebardata({
        searchTerm: searchTermfromurl || "",
        type: typefromurl || "all",
        parking: parkingfromurl === "true" ? true : false,
        furnished: furnishedfromurl === "true" ? true : false,
        offer: offerfromurl === "true" ? true : false,
        sort: sortfromurl || "created_at",
        order: orderfromurl || "desc",
      });
    }

    const fetchlistingdata = async () => {
      try {
        const searchQuery = urlParams.toString();
        setLoading(true);
        const res = await fetch(`/api/listing/getlistings?${searchQuery}`);
        const data = await res.json();
        setListing(data);
        setLoading(false);
        console.log(data);
        if (data.length > 8) {
          setShowmoreListing(true);
        } else {
          setShowmoreListing(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    fetchlistingdata();
  }, [location.search]);

  const onshowmorelisting = async () => {
    const numberoflisting = listing.length;
    const startIndex = numberoflisting;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/getlistings?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowmoreListing(false);
    }
    setListing([...listing, ...data]);
  };

  return (
    <div className="flex flex-col sm:flex-row">
      <div className="p-7 border-b-2 sm:border-r-2 sm:min-h-screen  ">
        <form onSubmit={handelSubmit} className="flex flex-col gap-7">
          <div className="flex items-center">
            <label>SearchTerm:</label>
            <input
              id="searchTerm"
              className="p-3 border rounded-lg ml-2"
              type="text"
              placeholder="search..."
              onChange={onChanges}
              value={sidebardata.searchTerm}
            />
          </div>
          <div className="flex gap-6 flex-wrap">
            <label>Type:</label>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={onChanges}
                checked={sidebardata.type === "all"}
              />
              <p>Rent & Sale</p>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={onChanges}
                checked={sidebardata.type === "rent"}
              />
              <p>Rent</p>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={onChanges}
                checked={sidebardata.type === "sale"}
              />
              <p>Sale</p>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={onChanges}
                checked={sidebardata.offer}
              />
              <p>Offer</p>
            </div>
          </div>
          <div className="flex gap-3">
            <label>Amenities:</label>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={onChanges}
                checked={sidebardata.furnished}
              />
              <p>Furnished</p>
            </div>
            <div className="flex gap-3">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={onChanges}
                checked={sidebardata.parking}
              />
              <p>Parking</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <label>Sort:</label>
            <div>
              <select
                id="sort_order"
                onChange={onChanges}
                className="p-3 rounded-lg"
              >
                <option value="regularPrice_desc">Price high to low</option>
                <option value="regularPrice_asc">Price low to high</option>
                <option value="createdAt_desc">Newest</option>
                <option value="createdAt_asc">Oldest</option>
              </select>
            </div>
          </div>
          <button className="p-3 bg-teal-500 rounded-lg text-white">
            Search
          </button>
        </form>
      </div>
      <div>
        <h1 className="text-3xl text-slate-600 border-b-2 p-3 ">
          Listing Results:
        </h1>
        <div className="flex flex-wrap p-7 gap-4">
          {!loading && listing.length === 0 && (
            <p className="p-3 text-xl text-slate-800">no Listing found!</p>
          )}
          {loading && (
            <p className="text-xl text-slate-800 w-full">Loading....</p>
          )}
          {!loading &&
            listing &&
            listing.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </div>
        {showmoreListing && (
          <button
            onClick={onshowmorelisting}
            className="p-3 w-full text-teal-800 font-semibold"
          >
            show more listing
          </button>
        )}
      </div>
    </div>
  );
};
