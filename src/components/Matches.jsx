import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Header from "./Header";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMatches } from "../utils/matchesSlice";
import MatchCard from "./MatchCard";

const Matches = () => {
  const dispatch = useDispatch();
  const userMatches = useSelector((store) => store.matches);

  const getMatches = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addMatches(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getMatches();
  }, []);

  if (!userMatches || userMatches.length == 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#f0f0f0]">
          <div className="text-xl text-center py-20">
            You don't have any matches yet
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#f0f0f0]">
        <div className="text-3xl font-bold text-center py-5">Your Matches</div>
        <div className="w-full flex flex-col items-center">
          {/*cards*/}
          {userMatches.map((match) => (
            <MatchCard userData={match} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Matches;
