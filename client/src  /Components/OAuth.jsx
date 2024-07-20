import React from "react";
import { FcGoogle } from "react-icons/fc";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { SignInSuccess } from "../Redux/user/user.slice";
import { useNavigate } from "react-router-dom";

export const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handelGoogleClick = async () => {
    const Provider = new GoogleAuthProvider();
    const auth = getAuth(app);
    const result = await signInWithPopup(auth, Provider);
    console.log(result);
    const res = await fetch("/api/auth/google", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      }),
    });
    const data = await res.json();
    console.log(data);
    dispatch(SignInSuccess(data));
    navigate("/");
  };

  return (
    <div
      onClick={handelGoogleClick}
      className="flex items-center border p-3 rounded-lg cursor-pointer"
    >
      <FcGoogle className="text-2xl" />
      <p className="ml-20">Continue with Google</p>
    </div>
  );
};
