import axios from "axios";
import { BASE_URL } from "../utils/constants";
import Header from "./Header";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addFeed } from "../utils/feedSlice";
import ProfileCard from "./profileCard";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";

const Feed = () => {
  const dispatch = useDispatch();
  const feedData = useSelector((store) => store.feed);
  console.log(feedData);

  const getFeed = async () => {
    if (feedData) return;
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

  return (
    <>
      <Header />
      <div className="flex w-full justify-center pt-5 pb-10 bg-[#f0f0f0]">
        <div className="w-1/2 bg-[#dedede] rounded-2xl flex flex-col items-center pt-5 pb-10">
          {feedData && (
            <ProfileCard
              userData={feedData[0]}
              image="https://media.istockphoto.com/id/1335941248/photo/shot-of-a-handsome-young-man-standing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=JSBpwVFm8vz23PZ44Rjn728NwmMtBa_DYL7qxrEWr38="
            />
          )}
          <div className="bg-pink-200 rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl w-80 mb-2">
            <FavoriteIcon fontSize="large" /> Interested
          </div>

          <div className="bg-gray-400 rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl w-80">
            <ClearIcon fontSize="large" /> Pass
          </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
