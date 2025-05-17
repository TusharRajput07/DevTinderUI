import React, { useEffect, useState } from "react";
import homeBG from "../assets/homeBG.jpg";
import HeaderHome from "./HeaderHome";
import { Link } from "react-router-dom";
import SplitText from "./SplitText";

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);

  const [visible1, setVisible1] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [visible3, setVisible3] = useState(false);
  const [visible4, setVisible4] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight; // how much you have come down
    const divPosition1 = document.getElementById("animateDiv1").offsetTop; // where the div starts (eg. 2000px)
    const divPosition2 = document.getElementById("animateDiv2").offsetTop;
    const divPosition3 = document.getElementById("animateDiv3").offsetTop;
    const divPosition4 = document.getElementById("animateDiv4").offsetTop;

    // check if the amount you have come down is more than the position where the div starts
    if (scrollPosition >= divPosition1 + 200) {
      setVisible1(true);
    } else {
      setVisible1(false);
    }

    if (scrollPosition >= divPosition2 + 200) {
      setVisible2(true);
    } else {
      setVisible2(false);
    }

    if (scrollPosition >= divPosition3 + 200) {
      setVisible3(true);
    } else {
      setVisible3(false);
    }

    if (scrollPosition >= divPosition4 + 200) {
      setVisible4(true);
    } else {
      setVisible4(false);
    }
  };

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <HeaderHome />
      <div className="relative h-[100vh] text-gray-300 w-full bg-[#f0f0f0]">
        <div className="w-full h-full overflow-hidden">
          <img
            className={`w-full -translate-y-24 brightness-50 transition-all duration-1000 ease-in-out ${
              isVisible ? "opacity-100 scale-[100%]" : "opacity-0 scale-[130%]"
            }`}
            // src="https://i.pinimg.com/originals/9f/72/f8/9f72f8a50440bddc3bcc2ad12fbcf4c0.gif"
            src="https://i.pinimg.com/originals/23/84/7c/23847ca0d98c0291cc6575ace24e727a.gif"
          />
        </div>

        <div className="absolute top-0 w-full h-[100vh] z-10 flex flex-col items-center justify-center  pt-10">
          <div className="text-8xl text-white font-extrabold font-sans">
            <SplitText className="text-white">DevTinder</SplitText>
          </div>
          <div className="text-2xl font-bold my-3">
            <SplitText>
              Find Developers. Make Connections. Build More Than Just Code
            </SplitText>
          </div>
          <div className="text-base font-light">
            <SplitText>
              Code, collaborate, connect—your developer circle starts here
            </SplitText>
          </div>
          <Link to="/login">
            <div
              className={`bg-[#404040] text-white text-xl font-medium mt-8 w-fit rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r from-[#753762] to-[#4b1745] animate-gradient transition-all duration-700 ease-in-out delay-500 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-y-20"
              }`}
            >
              <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
                Let's get started
              </div>
            </div>
          </Link>
        </div>
      </div>
      <div className="w-full flex flex-col gap-20 bg-[#291424] py-20 px-10 text-white">
        <div className="flex justify-start">
          <div
            id="animateDiv1"
            className={`w-1/2 p-2 transition-all duration-700 ease-in-out ${
              visible1
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-4xl font-bold mb-4">
              Connect with Like-Minded Developers 🧑‍💻
            </div>
            <div className="text-base font-light">
              Find collaborators who share your passion for code. Whether you're
              building a side project or searching for a co-founder, devTinder
              helps you match with developers who vibe with your tech stack and
              goals.
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div
            id="animateDiv2"
            className={`w-1/2 p-2 transition-all duration-700 ease-in-out ${
              visible2
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-4xl font-bold mb-4">
              Swipe. Match. Build. 💬
            </div>
            <div className="text-base font-light">
              Skip the networking fluff. Just swipe through developer profiles,
              match based on interests and skills, and start building cool stuff
              together. It’s like Tinder—minus the awkward dates, plus
              open-source dreams.
            </div>
          </div>
        </div>

        <div className="flex justify-start">
          <div
            id="animateDiv3"
            className={`w-1/2 p-2 transition-all duration-700 ease-in-out ${
              visible3
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-4xl font-bold mb-4">
              From Ideas to Execution ✨
            </div>
            <div className="text-base font-light">
              Got an idea but need a team? devTinder connects you with talented
              developers ready to bring your vision to life. Discover coders,
              designers, and thinkers who want to ship products—not just talk
              about them.
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <div
            id="animateDiv4"
            className={`w-1/2 p-2 transition-all duration-700 ease-in-out ${
              visible4
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="text-4xl font-bold mb-4">
              For Developers, By Developers 🪄
            </div>
            <div className="text-base font-light">
              Built with the dev community in mind, devTinder is your go-to
              space to meet collaborators, join projects, and grow your
              network—all in one place.
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
