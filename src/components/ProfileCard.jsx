import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";
import defaultProfile from "../assets/defaultProfile.webp";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

const ProfileCard = ({ userData }) => {
  const dispatch = useDispatch();
  const [slideDirection, setSlideDirection] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleClick = async (type) => {
    // Set animation direction
    setSlideDirection(type);
  };

  const handleAnimationEnd = async () => {
    // Call API here (interested or ignored)
    try {
      await axios.post(
        `${BASE_URL}/request/send/${slideDirection}/${userData._id}`,
        {},
        { withCredentials: true }
      );

      // Now remove the user from Redux
      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      if (
        err.response?.status === 400 &&
        err.response.data?.message === "connection request already exists!"
      ) {
        console.log("Connection request already exists.");
        // Optional: Show a toast or alert
      } else {
        console.error(err);
      }
    }

    setSlideDirection("");
  };

  // const sendRequest = async (status, _id) => {
  //   try {
  //     const res = await axios.post(
  //       BASE_URL + "/request/send/" + status + "/" + _id,
  //       {},
  //       { withCredentials: true }
  //     );
  //     console.log(res);
  //     dispatch(removeUserFromFeed(_id));
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const {
    firstName,
    lastName,
    bio,
    gender,
    age,
    photoURL,
    skills,
    hobbies,
    _id,
  } = userData;
  const [imageLoaded, setImageLoaded] = useState(false);
  return (
    <div
      className={`w-80 max-w-sm bg-[#4f404b] 0F0F0F text-[#f0f0f0] rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between my-5 p-2 pb-4 cursor-pointer transition-all duration-500 ease-in-out ${
        slideDirection === "ignored"
          ? "-translate-x-96 opacity-0"
          : slideDirection === "interested"
          ? "translate-x-96 opacity-0"
          : "translate-x-0 opacity-100"
      }  ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-40"
      }`}
      onTransitionEnd={slideDirection ? handleAnimationEnd : null}
    >
      {/* Image */}
      <div className="h-60 w-full overflow-hidden">
        {!imageLoaded && (
          <div className="w-full h-full rounded-xl bg-[#848383] flex items-center justify-center">
            <CircularProgress style={{ color: "white" }} />
          </div>
        )}

        <img
          className={`object-cover w-full h-full rounded-xl transition-opacity duration-300 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          src={photoURL || defaultProfile}
          onLoad={() => setImageLoaded(true)}
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

        <div></div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between px-3 gap-4">
        <div
          // onClick={() => sendRequest("interested", _id)}
          onClick={() => handleClick("ignored")}
          className="bg-[#222222] rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl"
        >
          <ClearIcon fontSize="large" />
        </div>
        <div
          // onClick={() => sendRequest("ignored", _id)}
          onClick={() => handleClick("interested")}
          className="bg-[#4b1745] rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl"
        >
          <FavoriteIcon fontSize="large" />
        </div>
      </div>

      {/* <div
        onClick={() => sendRequest("interested", _id)}
        className="bg-[#4b1745] rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl w-full mb-2"
      >
        <FavoriteIcon fontSize="large" /> Interested
      </div>

      <div
        onClick={() => sendRequest("ignored", _id)}
        className="bg-[#222222] rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl w-full"
      >
        <ClearIcon fontSize="large" /> Pass
      </div> */}
    </div>
  );
};

export default ProfileCard;
