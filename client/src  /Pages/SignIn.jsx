import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { OAuth } from "../Components/OAuth";
import { useDispatch, useSelector } from "react-redux";
import {
  SignInFailure,
  SignInStart,
  SignInSuccess,
} from "../Redux/user/user.slice";

export const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({});
  const { currentUser, loading, error } = useSelector((state) => state.user);

  console.log(formdata);

  const handelChangesinput = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SignInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(SignInFailure(data.message));
        return;
      }
      dispatch(SignInSuccess(data));
      console.log(data);
      navigate("/");
    } catch (error) {
      dispatch(SignInFailure(data.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center overline p-7">Sign In</h1>
      <form onSubmit={handelSubmit} className="flex flex-col gap-2">
        <input
          id="email"
          type="email"
          className="p-3 rounded-lg border"
          placeholder="Email...."
          onChange={handelChangesinput}
        />
        <input
          id="password"
          type="password"
          className="p-3 rounded-lg border"
          placeholder="Password...."
          onChange={handelChangesinput}
        />
        <button className="uppercase bg-teal-400 p-3 rounded-lg text-white hover:opacity-80">
          {loading ? "Loging...." : "Sign in"}
        </button>
        <OAuth />
      </form>
      <div className="mt-5 flex gap-3">
        <span>Have not an Account?</span>
        <Link to={"/sign-up"}>
          <span className="hover:underline cursor-pointer">Sign up</span>
        </Link>
      </div>
      {error && (
        <p className="text-red-700 font-semibold text-center">{error}</p>
      )}
    </div>
  );
};
