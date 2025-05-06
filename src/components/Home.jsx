import React from "react";
import homeBG from "../assets/homeBG.jpg";
import HeaderHome from "./HeaderHome";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <HeaderHome />
      <div className="relative h-[100vh] text-gray-300 w-full bg-[#f0f0f0]">
        {/* <div className="w-full h-full overflow-hidden">
          <img
            className="w-full -translate-y-24"
            src="https://images.pexels.com/photos/7420353/pexels-photo-7420353.jpeg"
          />
        </div> */}

        <div className="absolute top-0 w-full h-[100vh] z-10 flex flex-col items-center justify-center  pt-10 text-black">
          <div className="text-8xl font-extrabold">DevTinder</div>
          <div className="text-2xl font-bold my-3">
            Find Developers. Make Connections. Build More Than Just Code
          </div>
          <div className="text-base font-light">
            Code, collaborate, connect—your developer circle starts here
          </div>
          <Link to="/login">
            <div className="bg-[#404040] text-white text-xl font-medium mt-8 w-fit rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r  from-[#DD8E71] to-[#7e432d] animate-gradient">
              <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
                Let's get started
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Home;
