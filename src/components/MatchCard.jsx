import { useEffect, useState } from "react";
import defaultProfile from "../assets/defaultProfile.webp";

const MatchCard = ({ userData }) => {
  const { firstName, lastName, age, gender, bio, photoURL } = userData;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // setIsVisible(true);
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return (
    <div
      className={`w-1/2 transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div className="w-full flex items-center bg-[#4f404b] text-[#f0f0f0] rounded-2xl mb-5 p-2 border border-[#555555] hover:bg-[#5b4a56] transition-all duration-150 ease-in-out cursor-pointer">
        <div className="h-28 w-28 overflow-hidden">
          {photoURL ? (
            <img
              className="object-cover w-full h-full rounded-xl"
              src={photoURL}
            />
          ) : (
            <img
              className="object-cover w-full h-full rounded-xl"
              src={defaultProfile}
            />
          )}
        </div>
        <div className="px-4 w-full">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold mb-1">
              {firstName + " " + lastName}
              {age ? ", " + age : ""}
            </div>
            <div>{gender}</div>
          </div>
          <div className="text-sm">{bio}</div>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;
