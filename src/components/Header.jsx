import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SocialDistanceOutlinedIcon from "@mui/icons-material/SocialDistanceOutlined";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import defaultProfile from "../assets/defaultProfile.webp";

const Header = () => {
  const user = useSelector((store) => store?.user);
  const [isVisible, setIsVisible] = useState(false);
  const requestsData = useSelector((store) => store.requests);
  const [imageLoaded, setImageLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return (
    <header
      className={`w-full bg-[#291424] bg-gradient-to-b from-[#0b0109] ${
        location.pathname === "/recommend" ? "hidden" : "block"
      }`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center py-2 px-5 md:px-14">
        {/* Logo */}
        <div className="flex flex-col justify-center text-[#f0f0f0] pt-2 md:pt-0">
          {user && (
            <span
              style={{ fontSize: "10px" }}
              className={`font-light text-left transition-all duration-700 ease-in-out delay-300 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-20"
              }`}
            >
              {user?.firstName + " " + user?.lastName}'s
            </span>
          )}
          <Link to="/feed">
            <h1 className="text-xl md:text-2xl font-bold text-left">
              DevTinder
            </h1>
          </Link>
        </div>
        {/* Navigation */}
        <nav>
          {user && (
            <ul className="flex items-center space-x-3 md:space-x-6">
              <Link to="/feed">
                <li className="hidden md:block">
                  <Tooltip title="Explore" arrow>
                    <IconButton>
                      <DehazeOutlinedIcon className="text-[#b5b3b3] hover:text-[#747474]" />
                    </IconButton>
                  </Tooltip>
                </li>
              </Link>

              <Link to="/requests">
                <li>
                  <Tooltip title="Connection Requests" arrow>
                    <IconButton>
                      {requestsData.length > 0 ? (
                        <Badge color="secondary" variant="dot">
                          <SocialDistanceOutlinedIcon className="text-[#b5b3b3] hover:text-[#747474]" />
                        </Badge>
                      ) : (
                        <SocialDistanceOutlinedIcon className="text-[#b5b3b3] hover:text-[#747474]" />
                      )}
                    </IconButton>
                  </Tooltip>
                </li>
              </Link>

              <Link to="/matches">
                <li>
                  <Tooltip title="Your Matches" arrow>
                    <IconButton>
                      <FavoriteBorderOutlinedIcon className="text-[#b5b3b3] hover:text-[#747474]" />
                    </IconButton>
                  </Tooltip>
                </li>
              </Link>

              <li>
                <Tooltip title="Chats" arrow>
                  <IconButton>
                    <ChatBubbleOutlineIcon className="text-[#b5b3b3] hover:text-[#747474]" />
                  </IconButton>
                </Tooltip>
              </li>

              <Link to="/profile">
                <li>
                  <Tooltip title="Your Profile" arrow>
                    <div className="h-7 w-7 overflow-hidden">
                      {!imageLoaded && (
                        <div className="w-full h-full rounded-full bg-[#4e1b3d]"></div>
                      )}
                      <img
                        className={`object-cover w-full h-full rounded-full ${
                          imageLoaded ? "block" : "hidden"
                        }`}
                        src={user?.photoURL || defaultProfile}
                        alt="User profile"
                        onLoad={() => setImageLoaded(true)}
                      />
                    </div>
                  </Tooltip>
                </li>
              </Link>
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
