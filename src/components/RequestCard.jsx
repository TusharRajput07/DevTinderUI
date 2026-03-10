import api from "../utils/axios";
import defaultProfile from "../assets/defaultProfile.webp";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeRequest } from "../utils/requestsSlice";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useNavigate } from "react-router-dom";

const RequestCard = ({ userData }) => {
  const { firstName, lastName, age, gender, bio, photoURL } =
    userData?.fromUserId;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const reviewRequest = async (e, status, _id) => {
    e.stopPropagation(); // prevent card click from firing
    try {
      const res = await api.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      console.log(res?.data);
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className={`w-full md:w-1/2 transition-all duration-700 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
      }`}
    >
      <div
        onClick={() => navigate(`/requests/${userData?._id}`)}
        className="w-full bg-[#4f404b] text-[#f0f0f0] border border-[#555555] hover:bg-[#5b4a56] rounded-2xl mb-5 p-2 transition-all duration-150 ease-in-out cursor-pointer"
      >
        <div className="flex items-center">
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
          <div className="px-4 w-full">
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

        <div className="flex justify-center pb-1 pt-2">
          <div className="text-white text-base font-medium w-fit rounded-2xl cursor-pointer hover:shadow-lg bg-[#4b1745] mx-2">
            <div
              onClick={(e) => reviewRequest(e, "accepted", userData?._id)}
              className="px-10 py-2 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out"
            >
              Confirm
            </div>
          </div>
          <div
            onClick={(e) => reviewRequest(e, "rejected", userData?._id)}
            className="bg-[#222222] text-white text-base font-medium w-fit rounded-2xl cursor-pointer hover:shadow-lg mx-2"
          >
            <div className="px-10 py-2 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
              Delete
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
