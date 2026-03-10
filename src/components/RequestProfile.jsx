import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { removeRequest } from "../utils/requestsSlice";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import defaultProfile from "../assets/defaultProfile.webp";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const RequestProfile = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isVisible, setIsVisible] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  // get the request from redux store
  const request = useSelector((store) =>
    store.requests.find((r) => r._id === requestId),
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // if request not found in store, go back
  useEffect(() => {
    if (!request) navigate("/requests");
  }, [request]);

  if (!request) return null;

  const {
    firstName,
    lastName,
    age,
    gender,
    bio,
    photoURL,
    skills,
    hobbies,
    userLocation,
  } = request.fromUserId;

  const reviewRequest = async (status) => {
    setLoading(true);
    try {
      await api.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(requestId));
      navigate("/requests");
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#291424] text-[#f0f0f0] flex flex-col items-center pb-10">
      {/* back button */}
      <div className="w-full px-6 md:px-20 pt-6">
        <button
          onClick={() => navigate("/requests")}
          className="flex items-center gap-2 text-[#b5b3b3] hover:text-white transition-colors duration-150"
        >
          <ArrowBackIcon fontSize="small" />
          <span className="text-sm">Back to Requests</span>
        </button>
      </div>

      {/* profile card */}
      <div
        className={`w-80 max-w-sm bg-[#4f404b] text-[#f0f0f0] rounded-2xl shadow-lg overflow-hidden flex flex-col justify-between mt-6 p-2 pb-4 transition-all duration-500 ease-in-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-20"
        }`}
      >
        {/* Image */}
        <div className="h-70 w-full overflow-hidden relative">
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

          {userLocation && (
            <div className="text-sm text-[#acabac] bg-[#4a3845] rounded-xl py-1 px-2">
              <LocationOnIcon fontSize="small" className="pb-1" />
              <span>{userLocation}</span>
            </div>
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
        </div>

        {/* Confirm / Delete buttons */}
        <div className="flex justify-center pb-1 pt-2 gap-4">
          <div
            onClick={() => !loading && reviewRequest("accepted")}
            className={`text-white text-base font-medium w-fit rounded-2xl cursor-pointer hover:shadow-lg bg-[#4b1745] mx-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <div className="px-10 py-2 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
              Confirm
            </div>
          </div>
          <div
            onClick={() => !loading && reviewRequest("rejected")}
            className={`bg-[#222222] text-white text-base font-medium w-fit rounded-2xl cursor-pointer hover:shadow-lg mx-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
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

export default RequestProfile;
