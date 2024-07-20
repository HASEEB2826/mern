import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export const SignUp = () => {
  const navigate = useNavigate();
  const [formdata, setFormdata] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

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
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setError(null);
      setLoading(false);
      console.log(data);
      navigate('/sign-in')
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center overline p-7">Sign up</h1>
      <form onSubmit={handelSubmit} className="flex flex-col gap-2">
        <input
          id="username"
          type="text"
          className="p-3 rounded-lg border"
          placeholder="Username...."
          onChange={handelChangesinput}
        />
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
          {loading ? "Signing...." : "Sign up"}
        </button>
      </form>
      <div className="mt-5 flex gap-3">
        <span>Have an Account?</span>
        <Link to={'/sign-in'}>
        <span className="hover:underline cursor-pointer">Sign in</span>
        </Link>
      </div>
      {error && (
        <p className="text-red-700 font-semibold text-center">{error}</p>
      )}
    </div>
  );
};
