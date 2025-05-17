import React, { useEffect, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMediaQuery, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import SignoutDialog from "./SignoutDialog";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import DehazeOutlinedIcon from "@mui/icons-material/DehazeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import SocialDistanceOutlinedIcon from "@mui/icons-material/SocialDistanceOutlined";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";

const Header = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("md"));
  const user = useSelector((store) => store?.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const [openDialog, setOpenDialog] = useState(false);
  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleSignOut = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      navigate("/error");
    }
  };

  return (
    <header className="w-full bg-[#291424] bg-gradient-to-b from-[#140310]">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-2 px-14">
        {/* Logo */}
        <div className="flex flex-col justify-center text-[#f0f0f0]">
          {user && (
            <span
              className={`text-xs font-light transition-all duration-700 ease-in-out delay-300 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 -translate-x-20"
              }`}
            >
              {user?.firstName + " " + user?.lastName}'s
            </span>
          )}
          <h1 className="text-2xl font-bold">DevTinder</h1>
        </div>
        {/* Navigation */}
        <nav>
          {user && (
            <ul className="flex items-center space-x-6 font-medium">
              <Link to="/feed">
                <li>
                  <Tooltip title="Explore" arrow>
                    <IconButton>
                      <DehazeOutlinedIcon className="text-[#b5b3b3]" />
                    </IconButton>
                  </Tooltip>
                </li>
              </Link>
              <Link to="/profile">
                <li>
                  <Tooltip title="Your Profile" arrow>
                    <IconButton>
                      <Person2OutlinedIcon className="text-[#b5b3b3]" />
                    </IconButton>
                  </Tooltip>
                </li>
              </Link>

              <Link to="/requests">
                <li>
                  <Tooltip title="Connection Requests" arrow>
                    <IconButton>
                      <SocialDistanceOutlinedIcon className="text-[#b5b3b3]" />
                    </IconButton>
                  </Tooltip>
                </li>
              </Link>

              <Link to="/matches">
                <li>
                  <Tooltip title="Your Matches" arrow>
                    <IconButton>
                      <FavoriteBorderOutlinedIcon className="text-[#b5b3b3]" />
                    </IconButton>
                  </Tooltip>
                </li>
              </Link>

              <li>
                <Tooltip title="Chats" arrow>
                  <IconButton>
                    <ChatBubbleOutlineIcon className="text-[#b5b3b3]" />
                  </IconButton>
                </Tooltip>
              </li>
              {user && (
                <li>
                  <span className="hover:text-gray-900 transition italic font-bold bg-[#7e2971] text-gray-200 p-1 rounded-sm">
                    Hello {user?.firstName}
                  </span>
                </li>
              )}

              <div
                className="mb-1 cursor-pointer hover:text-red-500"
                onClick={handleDialog}
              >
                <Tooltip title="Logout" arrow>
                  <IconButton>
                    <LogoutIcon
                      className="text-[#b5b3b3]"
                      fontSize={isLarge ? "medium" : "small"}
                    />
                  </IconButton>
                </Tooltip>
              </div>
            </ul>
          )}
        </nav>

        <SignoutDialog
          open={openDialog}
          handleDialog={handleDialog}
          handleSignOut={handleSignOut}
        />
      </div>
    </header>
  );
};

export default Header;
