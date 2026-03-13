import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { addFeed } from "../utils/feedSlice";
import ProfileCard from "./ProfileCard";
import SplitText from "./SplitText";

const LIMIT = 10; // how many users to fetch per batch
const PREFETCH_THRESHOLD = 2; // fetch next batch when this many cards are left

const Feed = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const dispatch = useDispatch();
  const feedData = useSelector((store) => store.feed);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const getFeed = async () => {
    // dont fetch if already fetching or no more users on server
    if (isFetching || !feedData.hasMore) return;

    setIsFetching(true);
    try {
      const res = await api.get(
        `${BASE_URL}/feed?page=${feedData.page}&limit=${LIMIT}`,
        { withCredentials: true },
      );
      dispatch(addFeed(res?.data));
    } catch (err) {
      console.log("Failed to fetch feed:", err);
    } finally {
      setIsFetching(false);
    }
  };

  // initial fetch on mount
  useEffect(() => {
    if (feedData.users.length === 0 && feedData.hasMore) {
      getFeed();
    }
  }, []);

  // prefetch next batch when running low
  useEffect(() => {
    if (
      feedData.users.length <= PREFETCH_THRESHOLD &&
      feedData.hasMore &&
      !isFetching
    ) {
      getFeed();
    }
  }, [feedData.users.length]);

  // all caught up screen
  if (!feedData.hasMore && feedData.users.length === 0) {
    return (
      <div className="min-h-screen bg-[#291424] text-[#f0f0f0] flex justify-center items-center px-[20vw]">
        <div
          className={`text-xl md:text-5xl font-extrabold text-center transition-all duration-700 ease-in-out delay-150 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
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
    );
  }

  return (
    <div className="min-h-screen flex w-full justify-center pt-5 pb-10 bg-[#291424] text-[#f0f0f0]">
      {feedData.users.length > 0 && (
        <ProfileCard userData={feedData.users[0]} />
      )}
    </div>
  );
};

export default Feed;
