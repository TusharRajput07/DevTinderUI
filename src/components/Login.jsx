import { useRef, useState } from "react";
import HeaderHome from "./HeaderHome";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignUp = () => {
    setIsSignUp(!isSignUp);
    emailRef.current.value = "";
    passwordRef.current.value = "";
  };

  const handleClick = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // sign up
      console.log("hello");
    } else {
      // login
      try {
        const res = await axios.post(
          BASE_URL + "/login",
          {
            email: emailRef?.current?.value,
            password: passwordRef?.current?.value,
          },
          {
            withCredentials: true, // to set the cookies in browser
          }
        );
        setErrorMessage("");
        dispatch(addUser(res?.data));
        navigate("/feed");
      } catch (err) {
        console.log(err);
        if (err.response && err.response.data && err.response.data.message) {
          setErrorMessage(err.response.data.message);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      }
    }
  };

  return (
    <>
      <HeaderHome />
      <div className="px-10 md:px-40 py-30 bg-[#f0f0f0]  text-[#404040] ">
        {/* containers */}
        <div className="md:flex transition-all duration-700 ease-in-out ">
          {/* left container */}
          <div className="w-full md:w-1/2 flex flex-col justify-center gap-3 text-4xl font-extrabold">
            <span>Find Developers,</span>
            <span>Make Connections,</span>
            <span>Build More Than Just Code...</span>
          </div>
          {/* right container */}
          <div className="w-full md:w-1/2 flex flex-col mt-10 md:mt-0 items-center gap-4">
            <div className="text-xl font-semibold">
              {isSignUp ? "Create New Account" : "Resume your journey"}
            </div>
            <form className="w-full">
              {isSignUp && (
                <div className="w-full relative">
                  <input
                    ref={firstNameRef}
                    name="user_first_name"
                    placeholder="your first name"
                    className="bg-transparent border-2 border-gray-300 shadow-md rounded-full w-full p-4 mb-4"
                  />
                  <span className="absolute -top-2 left-3 bg-[#f0f0f0] text-xs text-gray-500  px-1">
                    First Name *
                  </span>
                </div>
              )}

              {isSignUp && (
                <div className="w-full relative">
                  <input
                    ref={lastNameRef}
                    name="user_last_name"
                    placeholder="your last name"
                    className="bg-transparent border-2 border-gray-300 shadow-md rounded-full w-full p-4 mb-4"
                  />
                  <span className="absolute -top-2 left-3 bg-[#f0f0f0] text-xs text-gray-500  px-1">
                    Last Name *
                  </span>
                </div>
              )}

              <div className="w-full relative">
                <input
                  ref={emailRef}
                  name="user_email"
                  placeholder="your email"
                  className="bg-transparent border-2 border-gray-300 shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#f0f0f0] text-xs text-gray-500 px-1">
                  Mail *
                </span>
              </div>

              <div className="w-full relative">
                <input
                  ref={passwordRef}
                  name="user_password"
                  placeholder="your password"
                  className="bg-transparent border-2 border-gray-300 shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#f0f0f0] text-xs text-gray-500 px-1">
                  Password *
                </span>
              </div>

              <div className="h-8 pb-2">
                <p className="text-sm text-red-600 self-start pl-2">
                  {errorMessage}
                </p>
              </div>

              <button
                onClick={handleClick}
                className="bg-[#404040] text-white text-xl font-medium w-full rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r  from-[#DD8E71] to-[#7e432d] animate-gradient"
              >
                <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
                  {isSignUp ? "Sign Up" : "Log in"}
                </div>
              </button>

              <div className="mt-6">
                <span className="mr-1">
                  {isSignUp ? "Already a user?" : "New to DevTinder?"}
                </span>
                <span
                  onClick={handleSignUp}
                  className="cursor-pointer font-bold hover:underline"
                >
                  {isSignUp ? "Log in" : "Sign up now."}
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
