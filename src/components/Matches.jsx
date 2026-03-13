import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import Header from "./Header";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMatches } from "../utils/matchesSlice";
import MatchCard from "./MatchCard";
import SplitText from "./SplitText";

const Matches = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const dispatch = useDispatch();
  const userMatches = useSelector((store) => store.matches);

  const getMatches = async () => {
    try {
      const res = await api.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addMatches(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMatches();
  }, []);

  if (!userMatches || userMatches.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-[#291424] text-[#f0f0f0] flex justify-center items-center px-[20vw]">
          <div
            className={`text-2xl md:text-5xl font-extrabold text-center transition-all duration-700 ease-in-out delay-150 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            <SplitText>No Matches yet!</SplitText>
            <SplitText>Keep Exploring.</SplitText>
            <SplitText className="text-lg md:text-3xl font-bold">
              Boost your chances! A more detailed profile helps the right
              connections find you. ✨
            </SplitText>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="bg-[#291424] text-[#f0f0f0] min-h-screen px-6 md:px-0">
        <div className="text-2xl md:text-3xl font-bold text-center py-5">
          Your Matches
        </div>
        <div className="w-full flex flex-col items-center">
          {/*cards*/}
          {userMatches.map((match) => (
            <MatchCard userData={match} key={match._id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Matches;
