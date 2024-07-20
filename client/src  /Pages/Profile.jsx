import { React, useEffect, useRef, useState } from "react";
import { MdDelete } from "react-icons/md";
import { LiaSignOutAltSolid } from "react-icons/lia";
import { useDispatch, useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import {
  DeleteInFailure,
  DeleteInStart,
  DeleteInSuccess,
  SignInFailure,
  SignInStart,
  SignInSuccess,
  SignOutInFailure,
  SignOutInStart,
  SignOutInSuccess,
} from "../Redux/user/user.slice";
import { Link } from "react-router-dom";

export const Profile = () => {
  const dispatch = useDispatch();
  const fileRef = useRef();
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [filePerc, setFilePerc] = useState(0);
  const [fileuploadErr, setFileuploadErr] = useState(false);
  const [file, setFiles] = useState(undefined);
  const [formdata, setFormdata] = useState({});
  const [showlistingerror, setShowlistingerror] = useState(false);
  const [listing, setListing] = useState({});

  console.log(formdata);

  useEffect(() => {
    if (file) {
      handeluploadImage(file);
    }
  }, [file]);

  const handeluploadImage = (file) => {
    const storage = getStorage();
    const filename = new Date().getTime() + file.name;
    const Ref = ref(storage, filename);
    const UploadTask = uploadBytesResumable(Ref, file);
    UploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
        setFilePerc(Math.round(progress));
      },
      (err) => {
        setFileuploadErr(true);
      },
      () => {
        getDownloadURL(UploadTask.snapshot.ref).then((downloadUrl) => {
          setFormdata({
            ...formdata,
            avatar: downloadUrl,
          });
        });
      }
    );
  };

  const handelChanges = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(SignInStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
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
    } catch (error) {
      dispatch(SignInFailure(error.message));
    }
  };

  const handeluserSignout = async () => {
    try {
      dispatch(SignOutInStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(SignOutInFailure(data.message));
        return;
      }
      dispatch(SignOutInSuccess(data));
    } catch (error) {
      dispatch(SignOutInFailure(error.message));
    }
  };

  const handeldeleteuser = async () => {
    try {
      dispatch(DeleteInStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(DeleteInFailure(data.message));
        return;
      }
      dispatch(DeleteInSuccess(data));
    } catch (error) {
      dispatch(DeleteInFailure(error.message));
    }
  };

  const handelShowlisting = async () => {
    try {
      const res = await fetch(`/api/user/getlisting/${currentUser._id}`);
      const data = await res.json();
      if (data.success === false) {
        setShowlistingerror(error.message);
        return;
      }
      setListing(data);
      console.log(data);
    } catch (error) {
      setShowlistingerror(error.message);
    }
  };

  const handelRemovelisting = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        setShowlistingerror(data.message);
        return;
      }
      setListing((listing) =>
        listing.filter((listing) => listing._id !== listingId)
      );
      console.log(data);
    } catch (error) {}
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center text-slate-700 overline my-7">
        User Profile
      </h1>
      <form onSubmit={handelSubmit} className="flex flex-col gap-4">
        <input
          type="file"
          ref={fileRef}
          onChange={(e) => setFiles(e.target.files[0])}
          hidden
        />
        <img
          src={formdata.avatar || currentUser.avatar}
          className="shadow-2xl rounded-full w-24 h-24 object-cover self-center cursor-pointer"
          alt="userImage"
          onClick={(e) => fileRef.current.click()}
        />
        <p className="text-center">
          {fileuploadErr ? (
            <span className="text-red-700 font-semibold">
              Image is not uploaded successfully
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-teal-700 font-semibold">
              Image upload Complete {filePerc} %{" "}
            </span>
          ) : filePerc === 100 ? (
            <span className="text-stone-700 font-semibold">
              Image is Uploaded Successfully
            </span>
          ) : null}
        </p>
        <input
          id="username"
          type="text"
          className="p-3 border rounded-lg "
          defaultValue={currentUser.username}
          onChange={handelChanges}
        />
        <input
          id="email"
          type="email"
          className="p-3 border rounded-lg "
          defaultValue={currentUser.email}
          onChange={handelChanges}
        />
        <input
          id="password"
          type="password"
          className="p-3 border rounded-lg "
          defaultValue={currentUser.password}
          onChange={handelChanges}
        />
        <button className="p-3 bg-teal-500 text-white rounded-lg hover:opacity-40">
          {loading ? "Updating User...." : " Update"}
        </button>
        <Link
          to={"/create-listing"}
          className="p-3 bg-emerald-500 rounded-lg text-center text-white hover:opacity-50"
        >
          Create Listing
        </Link>
      </form>
      <div className="flex justify-between mt-5">
        <p className="flex items-center gap-2">
          <MdDelete className="text-xl text-red-800" />
          <span
            onClick={handeldeleteuser}
            className="text-red-700 font-semibold hover:underline cursor-pointer"
          >
            Delete Account
          </span>
        </p>
        <p className="flex items-center gap-3">
          <LiaSignOutAltSolid className="text-xl text-teal-700" />
          <span
            onClick={handeluserSignout}
            className="text-teal-700 font-semibold hover:underline cursor-pointer"
          >
            Sign Out
          </span>
        </p>
      </div>
      <p
        onClick={handelShowlisting}
        className="mt-5 text-center font-semibold text-slate-800 hover:underline cursor-pointer"
      >
        Show Listing
      </p>
      {listing.length > 0 &&
        listing.map((listing) => (
          <div
            key={listing._id}
            className="flex justify-between items-center  p-3 rounded-sm overflow-hidden  "
          >
            <img
              src={listing.ImageUrl}
              className="w-16 object-contain rounded-lg hover:scale-105 transition-scale duration-300 "
              alt="listingImage"
            />
            <Link
              className="flex-1 ml-1 underline"
              to={`/listing/${listing._id}`}
            >
              <p>{listing.name}</p>
            </Link>
            <div className="flex items-center flex-col">
              <p
                onClick={() => handelRemovelisting(listing._id)}
                className="text-red-700 font-semibold hover:underline cursor-pointer mb-2"
              >
                Delete
              </p>
              <Link to={`/update-listing/${listing._id}`}>
                <p className="text-teal-700 font-semibold hover:underline cursor-pointer">
                  Edit
                </p>
              </Link>
            </div>
          </div>
        ))}
      {error && (
        <p className="text-red-700 font-semibold text-center mt-5">{error}</p>
      )}
    </div>
  );
};
