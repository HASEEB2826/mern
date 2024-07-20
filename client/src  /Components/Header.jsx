import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handelSubmit = (e) => {
    e.preventDefault();
    const Urlparam = new URLSearchParams(window.location.search);
    Urlparam.set("searchTerm", searchTerm);
    const searchQuery = Urlparam.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search);
    const searchTermUrl = urlSearch.get("searchTerm");
    if (searchTermUrl) {
      setSearchTerm(searchTermUrl);
    }
  }, [location.search]);

  return (
    <header className="bg-gradient-to-tr from-teal-300 to-slate-200">
      <div className="flex justify-between p-3 items-center max-w-4xl mx-auto">
        <h1 className="font-semibold">
          <span className="text-4xl">Royal</span>
          <span className="italic">Vilas</span>
        </h1>
        <form
          onSubmit={handelSubmit}
          className="bg-slate-100 rounded-lg p-3 flex items-center"
        >
          <input
            value={searchTerm}
            id="searchTerm"
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            className="bg-transparent w-24 sm:w-64 outline-none"
          />
          <button>
            <FaSearch />
          </button>
        </form>
        <ul className="flex gap-3 items-center">
          <Link to={"/"}>
            <li className="hidden sm:inline text-slate-700 text-xl hover:underline cursor-pointer scale-105 transition-scale duration-500 hover:text-black">
              Home
            </li>
          </Link>
          <Link to={"/about"}>
            <li className="hidden sm:inline text-slate-700 text-xl hover:scale-105 transition-scale duration-500 hover:underline cursor-pointer">
              About
            </li>
          </Link>
          <Link to={"/profile"}>
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profileImage"
                className="rounded-full w-10 h-10 border object-cover border-slate-400"
              />
            ) : (
              <li className="text-slate-700 text-xl hover:underline cursor-pointer">
                SignIn
              </li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};
