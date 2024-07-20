import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export const Contact = ({ listing }) => {
  const [landlord, setLandLord] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const res = await fetch(`/api/user/getuser/${listing.userRef}`);
        const data = await res.json();
        setLandLord(data);
        console.log(data);
      } catch (error) {}
    };
    fetchuser();
  }, []);

  return (
    <>
      {landlord && (
        <div className="flex flex-col gap-3">
          <p className="flex gap-2">
            Contact
            <span className="font-semibold">{landlord.username}</span>
            for
            <span className="font-semibold">{listing.name}</span>
          </p>
          <textarea
            onChange={(e) => setMessage(e.target.value)}
            rows={2}
            id="message"
            type="text"
            className="rounded-lg w-full border border-slate-600 p-3"
            placeholder="Type your message about listing to the landlord"
          />
          <Link
            to={`mailto:${landlord.email}?subject=regarding${listing.name}&body=${message}`}
            className="bg-cyan-900 text-center text-white p-3 rounded-lg"
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
};
