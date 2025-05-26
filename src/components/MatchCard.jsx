import { useEffect, useState } from "react";
import defaultProfile from "../assets/defaultProfile.webp";
import CircularProgress from "@mui/material/CircularProgress";

const MatchCard = ({ userData }) => {
  const { firstName, lastName, age, gender, bio, photoURL } = userData;
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return (
    <div
      className={`w-full md:w-1/2 transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div className="w-full flex items-center bg-[#4f404b] text-[#f0f0f0] rounded-2xl mb-5 p-2 border border-[#555555] hover:bg-[#5b4a56] transition-all duration-150 ease-in-out cursor-pointer">
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
            src={photoURL || defaultProfile}
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
    </div>
  );
};

export default MatchCard;
