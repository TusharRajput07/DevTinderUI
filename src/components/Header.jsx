import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { useMediaQuery, useTheme } from "@mui/material";
import { useSelector } from "react-redux";

const Header = () => {
  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up("md"));
  const user = useSelector((store) => store?.user);

  return (
    <header className="w-full  bg-gradient-to-b from-[#a3a2a2] bg-amber-100">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-14">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-900">DevTinder</h1>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6 text-gray-700 font-medium">
            <li>
              <a href="#" className="hover:text-gray-900 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900 transition">
                About
              </a>
            </li>

            <li>
              <a href="#" className="hover:text-gray-900 transition">
                Contact
              </a>
            </li>

            {user && (
              <li>
                <span className="hover:text-gray-900 transition italic font-bold">
                  Hello {user?.firstName}
                </span>
              </li>
            )}

            <div
              className="mb-1 cursor-pointer hover:text-red-500"
              //   onClick={handleDialog}
            >
              <LogoutIcon fontSize={isLarge ? "medium" : "small"} />
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
