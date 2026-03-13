import React, { useEffect, useState } from "react";
import HeaderHome from "./HeaderHome";
import { Link } from "react-router-dom";
import SplitText from "./SplitText";
import FooterHome from "./FooterHome";

const sections = [
  {
    title: "Connect with Like-Minded Developers 🧑‍💻",
    desc: "Find collaborators who share your passion for code. Whether you're building a side project or searching for a co-founder, DevTinder helps you match with developers who vibe with your tech stack and goals.",
    align: "left",
    id: "animateDiv1",
  },
  {
    title: "Swipe. Match. Build. 💬",
    desc: "Skip the networking fluff. Swipe through developer profiles, match based on interests and skills, and start building cool stuff together. It's like Tinder — minus the awkward dates, plus open-source dreams.",
    align: "right",
    id: "animateDiv2",
  },
  {
    title: "From Ideas to Execution ✨",
    desc: "Got an idea but need a team? DevTinder connects you with talented developers ready to bring your vision to life. Discover coders, designers, and thinkers who want to ship products — not just talk about them.",
    align: "left",
    id: "animateDiv3",
  },
  {
    title: "AI-Powered First Impressions 🪄",
    desc: "Let AI help you stand out. Generate a compelling bio from your skills and hobbies, and get smart icebreakers tailored to each match — so starting a conversation is never awkward again.",
    align: "right",
    id: "animateDiv4",
  },
  {
    title: "Real-Time Chat 🔥",
    desc: "No delays, no friction. Once you match with a developer, jump straight into a real-time conversation. Your next collaborator is one message away.",
    align: "left",
    id: "animateDiv5",
  },
  {
    title: "For Developers, By Developers 💻",
    desc: "Built with the dev community in mind, DevTinder is your go-to space to meet collaborators, join projects, and grow your network — all in one place.",
    align: "right",
    id: "animateDiv6",
  },
];

const Home = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});

  const handleScroll = () => {
    const scrollPosition = window.scrollY + window.innerHeight;
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el && scrollPosition >= el.offsetTop + 150) {
        setVisibleSections((prev) => ({ ...prev, [s.id]: true }));
      }
    });
  };

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <HeaderHome />

      {/* Hero */}
      <div className="relative h-[100vh] text-gray-300 w-full">
        <div className="w-full h-full overflow-hidden">
          <img
            className={`w-full h-full object-cover brightness-50 transition-all duration-1000 ease-in-out ${
              isVisible ? "opacity-100 scale-[100%]" : "opacity-0 scale-[130%]"
            }`}
            src="https://i.pinimg.com/originals/23/84/7c/23847ca0d98c0291cc6575ace24e727a.gif"
          />
        </div>
        <div className="absolute top-0 w-full h-[100vh] z-10 flex flex-col items-center justify-center pt-0 md:pt-10">
          <div className="text-5xl md:text-8xl text-white font-extrabold text-center">
            <SplitText className="text-white">DevTinder</SplitText>
          </div>
          <div className="text-xl md:text-2xl font-bold my-3 text-center">
            <SplitText>
              Find Developers. Make Connections. Build More Than Just Code
            </SplitText>
          </div>
          <div className="text-sm md:text-base font-light text-center">
            <SplitText>
              Code, collaborate, connect — your developer circle starts here
            </SplitText>
          </div>
          <Link to="/login">
            <div
              className={`text-white text-xl font-medium mt-8 w-fit rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r from-[#753762] to-[#4b1745] animate-gradient transition-all duration-700 ease-in-out delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-y-20"}`}
            >
              <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
                Let's get started
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Sections */}
      <div className="w-full bg-[#291424] py-16 md:py-24 px-6 md:px-20 text-white flex flex-col gap-10 md:gap-16">
        <div className="text-center">
          <div className="text-xs uppercase tracking-widest text-[#c084fc] mb-3 font-semibold">
            Why DevTinder
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold">
            Everything you need to
            <span className="bg-gradient-to-r from-[#c084fc] to-[#753762] bg-clip-text text-transparent">
              {" "}
              find your people
            </span>
          </h2>
        </div>

        {sections.map((s) => (
          <div
            key={s.id}
            id={s.id}
            className={`flex justify-${s.align === "right" ? "end" : "start"} transition-all duration-700 ease-in-out ${
              visibleSections[s.id]
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="w-full md:w-1/2 p-2">
              <div className="text-2xl md:text-4xl font-bold mb-1 md:mb-4">
                {s.title}
              </div>
              <div className="text-base font-light text-[#b0b0b0]">
                {s.desc}
              </div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="flex flex-col items-center gap-4 pt-8">
          <div className="text-2xl md:text-3xl font-extrabold text-center">
            Ready to find your developer match?
          </div>
          <Link to="/login">
            <div className="bg-gradient-to-r from-[#753762] to-[#4b1745] text-white text-xl font-medium rounded-full cursor-pointer hover:shadow-lg">
              <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
                Get Started for Free
              </div>
            </div>
          </Link>
        </div>
      </div>

      <FooterHome />
    </>
  );
};

export default Home;
