import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeaderHome from "./HeaderHome";
import FooterHome from "./FooterHome";
import CodeIcon from "@mui/icons-material/Code";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PeopleIcon from "@mui/icons-material/People";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import RocketLaunchIcon from "@mui/icons-material/RocketLaunch";

const features = [
  {
    icon: <PeopleIcon style={{ fontSize: 32 }} />,
    title: "Swipe on Developers",
    desc: "Browse developer profiles and connect with people who share your tech stack and interests.",
  },
  {
    icon: <FavoriteIcon style={{ fontSize: 32 }} />,
    title: "Mutual Matches",
    desc: "When two developers like each other, it's a match — and the conversation can begin.",
  },
  {
    icon: <ChatBubbleOutlineIcon style={{ fontSize: 32 }} />,
    title: "Real-time Chat",
    desc: "Chat instantly with your matches. No delays, no friction — just developers talking.",
  },
  {
    icon: <AutoAwesomeIcon style={{ fontSize: 32 }} />,
    title: "AI-Powered",
    desc: "Get AI-generated bios and icebreakers to help you make a great first impression.",
  },
  {
    icon: <CodeIcon style={{ fontSize: 32 }} />,
    title: "Built for Devs",
    desc: "Showcase your skills, hobbies, and GitHub links. Your profile speaks your language.",
  },
  {
    icon: <RocketLaunchIcon style={{ fontSize: 32 }} />,
    title: "Launch Together",
    desc: "Find co-founders, collaborators, or just someone to rubber-duck debug with.",
  },
];

const About = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setIsVisible(true));

    features.forEach((_, i) => {
      setTimeout(
        () => {
          setVisibleCards((prev) => [...prev, i]);
        },
        300 + i * 120,
      );
    });
  }, []);

  return (
    <>
      <HeaderHome />
      <div className="bg-[#291424] text-[#f0f0f0] w-full min-h-screen px-6 md:px-24 pb-20">
        {/* Hero */}
        <div className="flex flex-col items-center justify-center pt-20 pb-16 text-center">
          <div
            className={`transition-all duration-700 ease-in-out ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="text-xs uppercase tracking-widest text-[#c084fc] mb-4 font-semibold">
              About DevTinder
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Where Developers
              <br />
              <span className="bg-gradient-to-r from-[#c084fc] to-[#753762] bg-clip-text text-transparent">
                Find Each Other
              </span>
            </h1>
            <p className="text-[#b0b0b0] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              DevTinder is a developer-first networking app. Swipe, match, and
              connect with developers who think like you, build like you, and
              dream like you.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`w-24 h-1 bg-gradient-to-r from-[#753762] to-[#4b1745] mx-auto mb-16 rounded-full transition-all duration-700 delay-300 ${
            isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"
          }`}
        />

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((f, i) => (
            <div
              key={i}
              className={`bg-[#1e0f1a] border border-[#3d1f35] rounded-2xl p-6 flex flex-col gap-3 transition-all duration-500 ease-in-out hover:border-[#753762] hover:shadow-lg hover:shadow-[#75376220] ${
                visibleCards.includes(i)
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-8"
              }`}
            >
              <div className="text-[#c084fc]">{f.icon}</div>
              <div className="text-lg font-bold">{f.title}</div>
              <div className="text-[#9a8a95] text-sm leading-relaxed">
                {f.desc}
              </div>
            </div>
          ))}
        </div>

        {/* Mission statement */}
        <div
          className={`bg-gradient-to-r from-[#3d1f35] to-[#1e0f1a] border border-[#753762] rounded-3xl p-8 md:p-12 text-center mb-16 transition-all duration-700 delay-700 ease-in-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-2xl md:text-3xl font-extrabold mb-4">
            Built by a developer, for developers.
          </div>
          <p className="text-[#b0b0b0] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            The best projects are built with the right people. DevTinder exists
            to help you find your next collaborator, co-founder, or coding
            companion — one swipe at a time.
          </p>
        </div>

        {/* CTA */}
        <div
          className={`flex flex-col items-center gap-4 transition-all duration-700 delay-1000 ease-in-out ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="text-xl font-bold">Ready to find your people?</div>
          <div
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-[#753762] to-[#4b1745] text-white text-xl font-medium rounded-full cursor-pointer hover:shadow-lg hover:shadow-[#75376240]"
          >
            <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
              Get Started
            </div>
          </div>
        </div>
      </div>
      <FooterHome />
    </>
  );
};

export default About;
