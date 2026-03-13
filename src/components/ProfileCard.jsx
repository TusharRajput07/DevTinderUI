import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import defaultProfile from "../assets/defaultProfile.webp";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useEffect, useState, useCallback, useRef } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation } from "react-router-dom";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { addFeed } from "../utils/feedSlice";

const ProfileCard = ({ userData, onFetchMore }) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(null);

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // swiped left — next photo
        setPhotoIndex((prev) => (prev + 1) % photoList.length);
      } else {
        // swiped right — prev photo
        setPhotoIndex(
          (prev) => (prev - 1 + photoList.length) % photoList.length,
        );
      }
    }
    touchStartX.current = null;
  };
  const location = useLocation();
  const feedData = useSelector((store) => store.feed);

  const {
    firstName,
    lastName,
    bio,
    gender,
    age,
    photos,
    skills,
    hobbies,
    userLocation,
    _id,
  } = userData;

  // photos array — fallback to default if empty
  const photoList = photos?.filter(Boolean).length
    ? photos.filter(Boolean)
    : [defaultProfile];
  const currentPhoto = photoList[photoIndex] || defaultProfile;

  // reset index when switching users
  useEffect(() => {
    setPhotoIndex(0);
  }, [_id]);

  // preload first image — re-runs when the actual photo URL changes, not just _id
  useEffect(() => {
    setImageLoaded(false);
    setIsVisible(false);

    const src = photoList[0];

    // if it's the default (no real photo), just show immediately
    if (src === defaultProfile) {
      setImageLoaded(true);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    const img = new Image();
    img.onload = () => {
      setImageLoaded(true);
      requestAnimationFrame(() => setIsVisible(true));
    };
    img.onerror = () => {
      // if image fails to load, show card anyway with default
      setImageLoaded(true);
      requestAnimationFrame(() => setIsVisible(true));
    };
    img.src = src;
    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [photoList[0]]);

  const fetchMoreIfNeeded = useCallback(
    async (remainingCount) => {
      if (!feedData.hasMore) return;
      if (remainingCount > 2) return;
      try {
        const res = await api.get(
          BASE_URL + `/feed?page=${feedData.page}&limit=10`,
          { withCredentials: true },
        );
        dispatch(addFeed(res?.data));
      } catch (err) {
        console.log("Failed to fetch more users", err);
      }
    },
    [feedData.hasMore, feedData.page, dispatch],
  );

  const sendRequest = async (status, _id) => {
    if (location.pathname === "/profile") return;
    try {
      await api.post(
        BASE_URL + "/request/send/" + status + "/" + _id,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(_id));
      fetchMoreIfNeeded(feedData.users.length - 1);
    } catch (err) {
      console.log(err);
    }
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev - 1 + photoList.length) % photoList.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setPhotoIndex((prev) => (prev + 1) % photoList.length);
  };

  if (!imageLoaded) {
    return (
      <div className="w-80 h-[90vh] max-w-sm bg-[#4f404b] rounded-2xl flex items-center justify-center my-5">
        <CircularProgress style={{ color: "white" }} />
      </div>
    );
  }

  return (
    <div
      className={`w-80 h-fit max-w-sm bg-[#4f404b] hover:bg-[#5c4a57] text-[#f0f0f0] rounded-2xl shadow-lg hover:shadow-2xl overflow-hidden flex flex-col justify-between my-5 p-2 pb-4 cursor-pointer transition-all duration-500 ease-in-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-40"
      }`}
    >
      {/* Photo carousel */}
      <div
        className="relative h-70 w-full overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* sliding strip */}
        <div
          className="flex h-full"
          style={{
            width: `${photoList.length * 100}%`,
            transform: `translateX(-${(photoIndex * 100) / photoList.length}%)`,
            transition: "transform 0.4s ease-in-out",
          }}
        >
          {photoList.map((photo, i) => (
            <div
              key={i}
              className="h-full flex-shrink-0"
              style={{ width: `${100 / photoList.length}%` }}
            >
              <img
                src={photo}
                alt={`Photo ${i + 1}`}
                className="object-cover w-full h-full rounded-xl"
              />
            </div>
          ))}
        </div>

        {/* dot indicators */}
        {photoList.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {photoList.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  i === photoIndex ? "bg-white scale-125" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        )}

        {/* chevron buttons — desktop only, fade in on hover */}
        {photoList.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className={`hidden md:flex absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-0.5 transition-all duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <ChevronLeftIcon fontSize="small" />
            </button>
            <button
              onClick={handleNext}
              className={`hidden md:flex absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/60 text-white rounded-full p-0.5 transition-all duration-200 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <ChevronRightIcon fontSize="small" />
            </button>
          </>
        )}
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

      {/* Buttons */}
      <div className="flex justify-between px-3 gap-4">
        <div
          onClick={() => sendRequest("ignored", _id)}
          className="bg-[#222222] rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl"
        >
          <ClearIcon fontSize="large" />
        </div>
        <div
          onClick={() => sendRequest("interested", _id)}
          className="bg-[#4b1745] rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl"
        >
          <FavoriteIcon fontSize="large" />
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
