import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";
import defaultProfile from "../assets/defaultProfile.webp";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ProfileCard = ({ userData }) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  const {
    firstName,
    lastName,
    bio,
    gender,
    age,
    photoURL,
    skills,
    hobbies,
    userLocation,
    _id,
  } = userData;

  // Load image manually before showing the card
  useEffect(() => {
    setImageLoaded(false);
    setIsVisible(false);

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    };
    img.src = photoURL || defaultProfile;

    return () => {
      img.onload = null; // cleanup
    };
  }, [userData._id]);

  const sendRequest = async (status, _id) => {
    if (location.pathname === "/profile") return;
    try {
      const res = await axios.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      console.log(res);
      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      console.log(err);
    }
  };

  if (!imageLoaded) {
    return (
      <div className="w-80 h-[90vh] max-w-sm bg-[#4f404b] rounded-2xl flex items-center justify-center my-5">
        <CircularProgress style={{ color: "white" }} />
      </div>
    );
  }

  return (
    <div
      className={`w-80 h-fit max-w-sm bg-[#4f404b] hover:bg-[#5c4a57] text-[#f0f0f0] rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between my-5 p-2 pb-4 cursor-pointer transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-40"
      }`}
    >
      {/* Image */}
      <div className="h-70 w-full overflow-hidden">
        <img
          className="object-cover w-full h-full rounded-xl"
          src={photoURL || defaultProfile}
          alt="User profile"
        />
      </div>

      {/* Details */}
      <div className="pt-4 pb-2 px-2 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {firstName + " " + lastName}
            {age ? ", " + age : ""}
          </h2>
          <span className="text-sm">{gender}</span>
        </div>

        {bio && (
          <p className="text-sm bg-[#4a3845] rounded-xl py-1 px-2">{bio}</p>
        )}

        {userLocation && (
          <div className="text-sm text-[#acabac] bg-[#4a3845] rounded-xl py-1 px-2">
            <LocationOnIcon fontSize="small" className="pb-1" />
            <span>{userLocation}</span>
          </div>
        )}

        {skills && (
          <div className="bg-[#4a3845] rounded-xl py-1 px-2">
            <div className="font-bold text-sm">My professional skills:</div>
            <span className="text-xs">{skills}</span>
          </div>
        )}
        {hobbies && (
          <div className="bg-[#4a3845] rounded-xl py-1 px-2">
            <div className="font-bold text-sm">My hobbies beyond work:</div>
            <span className="text-xs">{hobbies}</span>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex justify-between px-3 gap-4">
        <div
          onClick={() => sendRequest("ignored", _id)}
          className="bg-[#222222] rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl"
        >
          <ClearIcon fontSize="large" />
        </div>
        <div
          onClick={() => sendRequest("interested", _id)}
          className="bg-[#4b1745] rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl"
        >
          <FavoriteIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
