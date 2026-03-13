import { useEffect, useState } from "react";
import defaultProfile from "../assets/defaultProfile.webp";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeMatch } from "../utils/matchesSlice";
import { useNavigate } from "react-router-dom";

const MatchCard = ({ userData }) => {
  const { firstName, lastName, age, gender, bio, photos, _id } = userData;
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [unmatching, setUnmatching] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleUnmatch = async (e) => {
    e.stopPropagation();
    setUnmatching(true);
    try {
      await api.delete(BASE_URL + "/request/unmatch/" + _id, {
        withCredentials: true,
      });
      dispatch(removeMatch(_id));
    } catch (err) {
      console.log(err);
      setUnmatching(false);
    }
  };

  const handleChat = (e) => {
    e.stopPropagation();
    navigate("/chat/" + _id);
  };

  return (
    <div
      className={`w-full md:w-1/2 transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div className="w-full bg-[#4f404b] text-[#f0f0f0] rounded-2xl mb-5 p-2 border border-[#555555] hover:bg-[#5b4a56] transition-all duration-150 ease-in-out">
        {/* user info row */}
        <div className="flex items-center cursor-pointer">
          <div className="h-28 w-28 overflow-hidden flex items-center justify-center">
            {!imageLoaded && (
              <div className="w-full h-full rounded-xl bg-[#726f71] flex items-center justify-center">
                <CircularProgress style={{ color: "white" }} />
              </div>
            )}
            <img
              className={`object-cover w-full h-full rounded-xl ${
                imageLoaded ? "block" : "hidden"
              }`}
              src={photos?.[0] || defaultProfile}
              alt="User profile"
              onLoad={() => setImageLoaded(true)}
            />
          </div>
          <div className="pl-3 pr-2 md:px-4 w-full">
            <div className="flex justify-between items-center">
              <div className="text-base md:text-xl font-semibold mb-1">
                {firstName + " " + lastName}
                {age ? ", " + age : ""}
              </div>
              <div className="text-xs md:text-base">{gender}</div>
            </div>
            <div className="text-xs md:text-sm">{bio}</div>
          </div>
        </div>

        {/* buttons */}
        <div className="flex justify-center pt-3 pb-1 gap-4">
          <div
            onClick={handleChat}
            className="text-white text-base font-medium w-fit rounded-2xl cursor-pointer hover:shadow-lg bg-[#4b1745] mx-2"
          >
            <div className="px-10 py-2 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
              Chat
            </div>
          </div>
          <div
            onClick={handleUnmatch}
            className={`bg-[#222222] text-white text-base font-medium w-fit rounded-2xl cursor-pointer hover:shadow-lg mx-2 ${
              unmatching ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="px-10 py-2 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
              {unmatching ? "Unmatching..." : "Unmatch"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
