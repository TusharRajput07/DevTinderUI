import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addFeed } from "../utils/feedSlice";
import ProfileCard from "./profileCard";
import SplitText from "./SplitText";
import { addRequests } from "../utils/requestsSlice";

const Feed = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);
  const dispatch = useDispatch();
  const feedData = useSelector((store) => store.feed);
  console.log(feedData);

  // gets feedData and stores them to the store
  const getFeed = async () => {
    // if (feedData) return;
    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });
      console.log(res?.data);
      dispatch(addFeed(res?.data));
    } catch (err) {
      console.log("something went wrong");
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  if (!feedData) return;

  if (!feedData || feedData.length === 0) {
    return (
      <>
        <div className="min-h-screen bg-[#291424] text-[#f0f0f0] flex justify-center items-center px-[20vw]">
          <div
            className={`text-xl md:text-5xl font-extrabold text-center transition-all duration-700 ease-in-out delay-150 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            <SplitText>You are all caught up!</SplitText>
            <SplitText>Take a break from the app.</SplitText>
            <SplitText className="text-lg md:text-3xl font-bold">
              Looks like things are a bit quiet right now. New developers and
              projects are joining all the time! ✨
            </SplitText>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen flex w-full justify-center pt-5 pb-10 bg-[#291424]  text-[#f0f0f0]">
        {feedData && <ProfileCard userData={feedData[0]} />}
      </div>
    </>
  );
};

export default Feed;
