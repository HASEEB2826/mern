import React, { useEffect, useState } from "react";
import { MdDelete } from "react-icons/md";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firebase";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateListing = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [files, setFiles] = useState({});
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUploadErr, setImageUploadErr] = useState(false);
  const [listingdata, setlistingdata] = useState({
    ImageUrl: [],
    name: "",
    description: "",
    address: "",
    type: "rent",
    furnished: false,
    parking: false,
    offer: false,
    bedroom: 0,
    bathroom: 0,
    regularPrice: 0,
    discountPrice: 0,
  });

  const params = useParams();

  useEffect(() => {
    const fetchuserlisting = async () => {
      const listing = params.listingId;
      const res = await fetch(`/api/listing/getlisting/${listing}`);
      const data = await res.json();
      setlistingdata(data);
    };
    fetchuserlisting();
  }, []);

  console.log(listingdata);
  console.log(files);

  const handelImageuploads = () => {
    if (files.length > 0 && files.length + listingdata.ImageUrl.length < 7) {
      const promises = [];
      setImageUploading(true);
      for (let i = 0; i < files.length; i++) {
        promises.push(StoreImage(files[i]));
      }
      Promise.all(promises)
        .then((url) => {
          setlistingdata({
            ...listingdata,
            ImageUrl: listingdata.ImageUrl.concat(url),
          });
          setImageUploading(false);
          setImageUploadErr(null);
        })
        .catch((err) => {
          setImageUploading(false);
          setImageUploadErr("Accept only Images not Else");
        });
    } else {
      setImageUploading(false);
      setImageUploadErr("Accept only 6 Images per Listing");
    }
  };

  const StoreImage = (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const filename = new Date().getTime() + file.name;
      const Storageref = ref(storage, filename);
      const UploadTask = uploadBytesResumable(Storageref, file);
      UploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (err) => {
          reject(err);
        },
        () => {
          getDownloadURL(UploadTask.snapshot.ref).then((downloadUrl) => {
            resolve(downloadUrl);
          });
        }
      );
    });
  };

  const handelDeltelistImage = (url) => {
    setlistingdata({
      ...listingdata,
      ImageUrl: listingdata.ImageUrl.filter((index) => index !== url),
    });
  };

  const handelChange = (e) => {
    const { id, type } = e.target;

    if (id === "rent" || id === "sale") {
      setlistingdata({
        ...listingdata,
        type: e.target.id,
      });
    }

    if (id === "parking" || id === "furnished" || id === "offer") {
      setlistingdata({
        ...listingdata,
        [e.target.id]: e.target.checked,
      });
    }

    if (type === "number" || type === "text" || type === "textarea") {
      setlistingdata({
        ...listingdata,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handelSubmission = async (e) => {
    e.preventDefault();
    try {
      if (listingdata.ImageUrl.length < 1)
        return setError("You can upload atleast one Image for Listing");
      if (+listingdata.discountPrice > +listingdata.regularPrice)
        return setError("You Discount Price must be lower than regular Price");
      setLoading(true);
      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...listingdata,
          userRef: currentUser._id,
        }),
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate(`/listing/${data._id}`);
      console.log(data);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-3">
      <h1 className="text-3xl text-center font-semibold my-7 overline">
        Update a Listing
      </h1>
      <form
        onSubmit={handelSubmission}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 flex flex-col gap-3">
          <input
            id="name"
            className="p-3 border rounded-lg outline-none"
            type="text"
            placeholder="Listing Name...."
            onChange={handelChange}
            value={listingdata.name}
            required
          />
          <textarea
            id="description"
            className="p-3 border rounded-lg outline-none"
            type="text"
            placeholder="Listing Description...."
            onChange={handelChange}
            value={listingdata.description}
            required
          />
          <input
            id="address"
            className="p-3 border rounded-lg"
            type="text"
            placeholder="Listing Address...."
            onChange={handelChange}
            value={listingdata.address}
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-3">
              <input
                id="rent"
                type="checkbox"
                className="w-5"
                onChange={handelChange}
                checked={listingdata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-3">
              <input
                id="sale"
                type="checkbox"
                className="w-5"
                onChange={handelChange}
                checked={listingdata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-3">
              <input
                id="parking"
                type="checkbox"
                className="w-5"
                onChange={handelChange}
                checked={listingdata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-3">
              <input
                id="furnished"
                type="checkbox"
                className="w-5"
                onChange={handelChange}
                checked={listingdata.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-3">
              <input
                id="offer"
                type="checkbox"
                className="w-5"
                onChange={handelChange}
                checked={listingdata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex gap-6 flex-wrap">
            <div className="flex items-center gap-3">
              <input
                id="bedroom"
                type="number"
                className="border w-16 rounded-full h-16 text-center"
                min={1}
                max={12}
                onChange={handelChange}
                value={listingdata.bedroom}
              />
              <p>Bedrooms</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="bathroom"
                type="number"
                className="border w-16 rounded-full h-16 text-center"
                min={1}
                max={12}
                onChange={handelChange}
                value={listingdata.bathroom}
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="regularPrice"
                type="number"
                className="border w-24 rounded-lg h-10 text-center"
                min={500}
                max={10000}
                onChange={handelChange}
                value={listingdata.regularPrice}
              />
              <p>Regular Price</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="discountPrice"
                type="number"
                className="border w-24 rounded-lg h-10 text-center"
                min={500}
                max={10000}
                onChange={handelChange}
                value={listingdata.discountPrice}
              />
              <p>Discount Price</p>
            </div>
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5">
          <p className="font-semibold">
            Images:{" "}
            <span className="ml-1 text-red-700 underline">
              Accept Only 6 Images per Listing
            </span>
          </p>
          <div className="flex gap-2">
            <input
              className="border border-teal-400 p-3 shadow-lg rounded-lg w-full"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(e.target.files)}
            />
            <button
              type="button"
              onClick={handelImageuploads}
              className="border border-teal-400 rounded-lg p-3 hover:shadow-2xl hover:bg-teal-400 scale-105 transition-scale duration-300 hover:text-white"
            >
              {imageUploading ? "Uploading" : "Upload"}
            </button>
          </div>
          {listingdata.ImageUrl.length > 0 &&
            listingdata.ImageUrl.map((url) => (
              <div
                key={url}
                className="border p-3 rounded-lg flex justify-between items-center"
              >
                <img className="w-14 object-contain" src={url} alt="" />
                <button type="button">
                  <MdDelete
                    onClick={() => handelDeltelistImage(url)}
                    className="text-xl text-red-800 hover:opacity-45"
                  />
                </button>
              </div>
            ))}
          <button className="p-3 bg-teal-400 text-white rounded-lg hover:opacity-50">
            {loading ? "Updating" : "Update Listing"}
          </button>
          {imageUploadErr && (
            <p className="text-red-700 font-semibold text-center">
              {imageUploadErr}
            </p>
          )}
          {error && (
            <p className="text-red-700 font-semibold text-center">{error}</p>
          )}
        </div>
      </form>
    </div>
  );
};
