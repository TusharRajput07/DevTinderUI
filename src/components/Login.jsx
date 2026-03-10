import { useEffect, useRef, useState } from "react";
import HeaderHome from "./HeaderHome";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import SplitText from "./SplitText";
import FooterHome from "./FooterHome";
import api from "../utils/axios";

const Login = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const handleSignUp = () => {
    setIsSignUp(!isSignUp);
    emailRef.current.value = "";
    passwordRef.current.value = "";
  };

  // UI form validation
  const validateFormData = (firstName, lastName, email, password, isSignUp) => {
    const isEmailValid =
      /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(email);
    const isPasswordValid =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password);

    if (isSignUp && !firstName?.trim()) return "First Name is required!";
    else if (isSignUp && firstName.length > 15)
      return "First Name cannot exceed 15 characters!";
    else if (isSignUp && !lastName?.trim()) return "Last Name is required!";
    else if (isSignUp && lastName.length > 15)
      return "Last Name cannot exceed 15 characters!";
    else if (!email) return "Email is required!";
    else if (!isEmailValid) return "Email is not valid!";
    else if (!password) return "Password is required!";
    else if (!isPasswordValid)
      return "Password should have atleast 8 characters. one capital, one small alphabet, and one digit.";
    return null;
  };

  const handleClick = async (e) => {
    e.preventDefault();

    const firstName = firstNameRef?.current?.value;
    const lastName = lastNameRef?.current?.value;
    const email = emailRef?.current?.value;
    const password = passwordRef?.current?.value;

    if (isSignUp) {
      // sign up

      // input UI validation
      let response;
      response = validateFormData(
        firstName,
        lastName,
        email,
        password,
        isSignUp,
      );
      setErrorMessage(response);
      if (response !== null) {
        // entries not valid
        return;
      }

      try {
        const res = await api.post(
          BASE_URL + "/signup",
          {
            firstName: firstNameRef?.current?.value,
            lastName: lastNameRef?.current?.value,
            email: emailRef?.current?.value,
            password: passwordRef?.current?.value,
          },
          {
            withCredentials: true, // to set the cookies in browser
          },
        );
        setErrorMessage("");

        dispatch(addUser(res?.data?.data));
        navigate("/recommend");
      } catch (err) {
        console.log(err);
        if (err.response && err.response.data && err.response.data.error) {
          setErrorMessage(err.response.data.error);
        } else {
          setErrorMessage("Something went wrong. Please try again.");
        }
      }
    } else {
      // login
      try {
        const res = await api.post(
          BASE_URL + "/login",
          {
            email: emailRef?.current?.value,
            password: passwordRef?.current?.value,
          },
          {
            withCredentials: true, // to set the cookies in browser
          },
        );

        setErrorMessage("");
        dispatch(addUser(res?.data));
        navigate("/feed");
      } catch (err) {
        console.log(err, "errrrrrr");
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
      <div className="px-6 md:px-40 py-20 md:py-30 bg-[#291424]  text-[#f0f0f0] ">
        {/* containers */}
        <div className="md:flex transition-all duration-700 ease-in-out">
          {/* left container */}
          <div
            className={`w-full md:w-1/2 flex flex-col justify-center gap-3 text-3xl md:text-4xl font-extrabold transition-all duration-700 ease-in-out delay-150 text-center md:text-left pb-3 md:pb-0 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-20"
            }`}
          >
            <SplitText>Find Developers,</SplitText>
            <SplitText>Make Connections,</SplitText>
            <SplitText>Build More Than Just Code...</SplitText>
          </div>
          {/* right container */}
          <div
            className={`w-full md:w-1/2 flex flex-col mt-10 md:mt-0 items-center gap-4 transition-all duration-700 ease-in-out delay-500 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            <div className="text-lg md:text-xl font-semibold">
              {isSignUp ? "Create New Account" : "Resume your journey"}
            </div>
            <form className="w-full">
              {isSignUp && (
                <div className="w-full relative">
                  <input
                    ref={firstNameRef}
                    name="user_first_name"
                    placeholder="your first name"
                    className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                  />
                  <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b]  px-1">
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
                    className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                  />
                  <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b]   px-1">
                    Last Name *
                  </span>
                </div>
              )}

              <div className="w-full relative">
                <input
                  ref={emailRef}
                  name="user_email"
                  placeholder="your email"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b]  px-1">
                  Mail *
                </span>
              </div>

              <div className="w-full relative">
                <input
                  // type="password"
                  ref={passwordRef}
                  name="user_password"
                  placeholder="your password"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b]  px-1">
                  Password *
                </span>
              </div>

              <div className="h-8 pb-2 mb-3">
                <p className="text-sm text-red-600 self-start pl-2">
                  {errorMessage}
                </p>
              </div>

              <button
                onClick={handleClick}
                className="bg-[#404040] text-white text-xl font-medium w-full rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r  from-[#753762] to-[#4b1745] animate-gradient"
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
      <FooterHome />
    </>
  );
};

export default Login;
