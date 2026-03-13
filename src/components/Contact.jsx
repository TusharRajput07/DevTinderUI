import { useEffect, useState, useRef } from "react";
import HeaderHome from "./HeaderHome";
import FooterHome from "./FooterHome";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

const Contact = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const name = nameRef.current.value.trim();
    const email = emailRef.current.value.trim();
    const message = messageRef.current.value.trim();

    if (!name) return setErrorMessage("Name is required.");
    if (!email) return setErrorMessage("Email is required.");
    if (!message) return setErrorMessage("Message is required.");

    setLoading(true);
    try {
      await api.post(BASE_URL + "/contact", { name, email, message });
      setSuccessMessage("Thanks for reaching out! We'll get back to you soon.");
      nameRef.current.value = "";
      emailRef.current.value = "";
      messageRef.current.value = "";
    } catch (err) {
      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <HeaderHome />
      <div className="bg-[#291424] text-[#f0f0f0] w-full min-h-screen px-6 md:px-24 pb-20">
        {/* Hero */}
        <div className="flex flex-col items-center justify-center pt-20 pb-12 text-center">
          <div
            className={`transition-all duration-700 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="text-xs uppercase tracking-widest text-[#c084fc] mb-4 font-semibold">
              Get in Touch
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              We'd love to
              <br />
              <span className="bg-gradient-to-r from-[#c084fc] to-[#753762] bg-clip-text text-transparent">
                hear from you
              </span>
            </h1>
            <p className="text-[#b0b0b0] text-lg max-w-xl mx-auto leading-relaxed">
              Have a question, feedback, or just want to say hi? Drop us a
              message and we'll get back to you.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`w-24 h-1 bg-gradient-to-r from-[#753762] to-[#4b1745] mx-auto mb-16 rounded-full transition-all duration-700 delay-300 ${isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
        />

        {/* Content */}
        <div
          className={`flex flex-col md:flex-row gap-12 max-w-5xl mx-auto transition-all duration-700 delay-300 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          {/* Left — contact info */}
          <div className="w-full md:w-2/5 flex flex-col gap-6">
            <div className="bg-[#1e0f1a] border border-[#3d1f35] rounded-2xl p-6">
              <div className="text-lg font-bold mb-4">Contact Info</div>
              <div className="flex flex-col gap-4 text-[#9a8a95]">
                <div className="flex items-center gap-3">
                  <EmailOutlinedIcon className="text-[#c084fc]" />
                  <span>support@devtinder.com</span>
                </div>
                {/* <div className="flex items-center gap-3">
                  <GitHubIcon className="text-[#c084fc]" />
                  <a
                    href="https://github.com/TusharRajput07/DevTinder"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition"
                  >
                    github.com/TusharRajput07/DevTinder
                  </a>
                </div> */}
                <div className="flex items-center gap-3">
                  <LinkedInIcon className="text-[#c084fc]" />
                  <a
                    href="https://www.linkedin.com/in/tusharrajput71/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition"
                  >
                    linkedin.com/in/tusharrajput71
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <BusinessCenterIcon className="text-[#c084fc]" />
                  <a
                    href="https://portfolio-nine-topaz-35.vercel.app/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-white transition"
                  >
                    portfolio/tusharrajput
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#3d1f35] to-[#1e0f1a] border border-[#753762] rounded-2xl p-6">
              <div className="text-base font-bold mb-2">Response Time</div>
              <p className="text-[#9a8a95] text-sm leading-relaxed">
                We typically respond within 24–48 hours. For urgent issues,
                reach out on GitHub.
              </p>
            </div>
          </div>

          {/* Right — form */}
          <div className="w-full md:w-3/5">
            <form className="flex flex-col gap-4" autoComplete="off">
              <div className="w-full relative">
                <input
                  ref={nameRef}
                  name="contact_name"
                  placeholder="your name"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Name *
                </span>
              </div>
              <div className="w-full relative">
                <input
                  ref={emailRef}
                  name="contact_email"
                  placeholder="your email"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Email *
                </span>
              </div>
              <div className="w-full relative">
                <textarea
                  ref={messageRef}
                  name="contact_message"
                  rows={6}
                  placeholder="your message..."
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-3xl w-full p-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Message *
                </span>
              </div>

              <div>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && (
                  <Alert severity="success">{successMessage}</Alert>
                )}
                {!errorMessage && !successMessage && <div className="h-8" />}
              </div>

              {!successMessage && (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-gradient-to-r from-[#753762] to-[#4b1745] text-white text-xl font-medium w-full rounded-full cursor-pointer hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out gap-3">
                    {loading ? (
                      <>
                        <CircularProgress
                          size={20}
                          style={{ color: "white" }}
                        />{" "}
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </div>
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
      <FooterHome />
    </>
  );
};

export default Contact;
