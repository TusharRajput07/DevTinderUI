import { useNavigate } from "react-router-dom";
import HeaderHome from "./HeaderHome";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const Recommend = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const userData = useSelector((store) => store.user);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return (
    <>
      <HeaderHome />
      <div className="bg-[#291424] text-[#f0f0f0] w-full min-h-screen flex items-center justify-center px-5">
        <div
          className={`transition-all duration-700 ease-in-out delay-300 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
          }`}
        >
          <div className="w-full flex flex-col items-center justify-center pt-0 md:pt-10">
            <div className="text-5xl font-extrabold text-center">
              Welcome to DevTinder {userData?.firstName}!
            </div>
            <div className="text-2xl font-bold my-3 text-center">
              Let's get your profile set up.
            </div>
            <div className="text-base font-light text-center">
              Completing your profile helps you connect with the right
              developers and showcase your skills better.
            </div>
            <div
              onClick={() => navigate("/profile")}
              className="bg-[#404040] text-white text-xl font-medium mt-8 w-fit rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r  from-[#753762] to-[#4b1745] animate-gradient"
            >
              <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
                Start Editing My Profile
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Recommend;
