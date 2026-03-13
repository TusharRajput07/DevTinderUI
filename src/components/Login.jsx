import { useEffect, useRef, useState } from "react";
import HeaderHome from "./HeaderHome";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import SplitText from "./SplitText";
import FooterHome from "./FooterHome";
import api from "../utils/axios";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const blockedDomains = [
  "gnail.com",
  "gmai.com",
  "gmial.com",
  "gamil.com",
  "gmaill.com",
  "yahooo.com",
  "yaho.com",
  "yhoo.com",
  "hotmial.com",
  "hotmal.com",
  "outloo.com",
  "outlok.com",
  "fakemail.com",
  "tempmail.com",
  "mailinator.com",
  "guerrillamail.com",
  "throwaway.email",
  "fakeinbox.com",
  "dispostable.com",
];

// mode: "login" | "signup" | "forgot"
const Login = () => {
  const [mode, setMode] = useState("login");
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const forgotEmailRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailPending, setEmailPending] = useState(false);
  const pendingEmailRef = useRef("");
  const pollRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    if (!emailPending) return;
    pollRef.current = setInterval(async () => {
      try {
        const res = await api.post(
          BASE_URL + "/check-verified",
          { email: pendingEmailRef.current },
          { withCredentials: true },
        );
        if (res?.data?.isVerified) {
          clearInterval(pollRef.current);
          setEmailPending(false);
          setSuccessMessage("✅ Email verified! You can now log in.");
        }
      } catch (err) {}
    }, 3000);
    return () => clearInterval(pollRef.current);
  }, [emailPending]);

  const resetMessages = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const switchMode = (newMode) => {
    resetMessages();
    setEmailPending(false);
    setMode(newMode);
    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
  };

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
    else if (isSignUp) {
      const domain = email.split("@")[1]?.toLowerCase();
      if (blockedDomains.includes(domain))
        return "Please enter a valid email address!";
    }
    if (!password) return "Password is required!";
    else if (!isPasswordValid)
      return "Password should have at least 8 characters, one capital, one small alphabet, and one digit.";
    return null;
  };

  const handleClick = async (e) => {
    e.preventDefault();
    resetMessages();
    setLoading(true);

    const firstName = firstNameRef?.current?.value;
    const lastName = lastNameRef?.current?.value;
    const email = emailRef?.current?.value;
    const password = passwordRef?.current?.value;

    if (mode === "signup") {
      const response = validateFormData(
        firstName,
        lastName,
        email,
        password,
        true,
      );
      if (response !== null) {
        setErrorMessage(response);
        setLoading(false);
        return;
      }
      try {
        const res = await api.post(
          BASE_URL + "/signup",
          { firstName, lastName, email, password },
          { withCredentials: true },
        );
        if (res?.data?.message === "verification_pending") {
          setLoading(false);
          pendingEmailRef.current = email;
          setSuccessMessage(
            "Account created! Please check your email to verify your account.",
          );
          setEmailPending(true);
          return;
        }
        dispatch(addUser(res?.data?.data));
        navigate("/recommend");
      } catch (err) {
        setErrorMessage(
          err.response?.data?.error ||
            "Something went wrong. Please try again.",
        );
        setLoading(false);
      }
    } else {
      try {
        const res = await api.post(
          BASE_URL + "/login",
          { email, password },
          { withCredentials: true },
        );
        setLoading(false);
        dispatch(addUser(res?.data));
        const u = res?.data;
        if (!u?.age || !u?.gender) navigate("/recommend");
        else navigate("/feed");
      } catch (err) {
        setErrorMessage(
          err.response?.data?.message ||
            "Something went wrong. Please try again.",
        );
        setLoading(false);
      }
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    resetMessages();
    const email = forgotEmailRef?.current?.value;
    if (!email) {
      setErrorMessage("Please enter your email address.");
      return;
    }
    setLoading(true);
    try {
      await api.post(BASE_URL + "/forgot-password", { email });
      setSuccessMessage("Reset link sent! Please check your email.");
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const title =
    mode === "signup"
      ? "Create New Account"
      : mode === "forgot"
        ? "Reset your password"
        : "Resume your journey";

  return (
    <>
      <HeaderHome />
      <div className="px-6 md:px-40 py-20 md:py-30 bg-[#291424] text-[#f0f0f0]">
        <div className="md:flex transition-all duration-700 ease-in-out">
          {/* left */}
          <div
            className={`w-full md:w-1/2 flex flex-col justify-center gap-3 text-3xl md:text-4xl font-extrabold transition-all duration-700 ease-in-out delay-150 text-center md:text-left pb-3 md:pb-0 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-20"}`}
          >
            <SplitText>Find Developers,</SplitText>
            <SplitText>Make Connections,</SplitText>
            <SplitText>Build More Than Just Code...</SplitText>
          </div>

          {/* right */}
          <div
            className={`w-full md:w-1/2 flex flex-col mt-10 md:mt-0 items-center gap-4 transition-all duration-700 ease-in-out delay-500 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"}`}
          >
            <div className="text-lg md:text-xl font-semibold">{title}</div>

            <form className="w-full" autoComplete="off">
              {/* ── FORGOT PASSWORD MODE ── */}
              {mode === "forgot" && (
                <>
                  <div className="w-full relative">
                    <input
                      ref={forgotEmailRef}
                      name="forgot_email"
                      placeholder="your email"
                      className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                    />
                    <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                      Mail *
                    </span>
                  </div>

                  <div className="mb-3">
                    {errorMessage && (
                      <Alert severity="error">{errorMessage}</Alert>
                    )}
                    {successMessage && (
                      <Alert severity="success">{successMessage}</Alert>
                    )}
                    {!errorMessage && !successMessage && (
                      <div className="h-8" />
                    )}
                  </div>

                  {!successMessage && (
                    <button
                      onClick={handleForgotPassword}
                      disabled={loading}
                      className="bg-[#404040] text-white text-xl font-medium w-full rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r from-[#753762] to-[#4b1745] animate-gradient disabled:opacity-70 disabled:cursor-not-allowed"
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
                          "Send Reset Link"
                        )}
                      </div>
                    </button>
                  )}

                  <div className="mt-6">
                    <span className="mr-1">Remembered it?</span>
                    <span
                      onClick={() => switchMode("login")}
                      className="cursor-pointer font-bold hover:underline"
                    >
                      Back to login
                    </span>
                  </div>
                </>
              )}

              {/* ── LOGIN / SIGNUP MODE ── */}
              {mode !== "forgot" && (
                <>
                  {mode === "signup" && (
                    <div className="w-full relative">
                      <input
                        ref={firstNameRef}
                        name="user_first_name"
                        placeholder="your first name"
                        className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                      />
                      <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                        First Name *
                      </span>
                    </div>
                  )}
                  {mode === "signup" && (
                    <div className="w-full relative">
                      <input
                        ref={lastNameRef}
                        name="user_last_name"
                        placeholder="your last name"
                        className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                      />
                      <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
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
                    <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                      Mail *
                    </span>
                  </div>
                  <div className="w-full relative">
                    <input
                      ref={passwordRef}
                      name="user_password"
                      type={showPassword ? "text" : "password"}
                      placeholder="your password"
                      className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4 pr-14"
                    />
                    <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                      Password *
                    </span>
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-4 cursor-pointer text-[#7b7b7b] hover:text-[#f0f0f0]"
                    >
                      {showPassword ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </span>
                  </div>

                  {/* Forgot password link — only on login mode */}
                  {mode === "login" && (
                    <div className="text-right -mt-2 mb-3">
                      <span
                        onClick={() => switchMode("forgot")}
                        className="text-sm text-[#c084fc] cursor-pointer hover:underline"
                      >
                        Forgot password?
                      </span>
                    </div>
                  )}

                  <div className="mb-3">
                    {errorMessage && (
                      <Alert severity="error">{errorMessage}</Alert>
                    )}
                    {successMessage && (
                      <Alert severity="success">{successMessage}</Alert>
                    )}
                    {!errorMessage && !successMessage && (
                      <div className="h-8" />
                    )}
                  </div>

                  {!emailPending && (
                    <button
                      onClick={handleClick}
                      disabled={loading}
                      className="bg-[#404040] text-white text-xl font-medium w-full rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r from-[#753762] to-[#4b1745] animate-gradient disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                      <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out gap-3">
                        {loading ? (
                          <>
                            <CircularProgress
                              size={20}
                              style={{ color: "white" }}
                            />
                            {mode === "signup"
                              ? "Sending email..."
                              : "Logging in..."}
                          </>
                        ) : mode === "signup" ? (
                          "Sign Up"
                        ) : (
                          "Log in"
                        )}
                      </div>
                    </button>
                  )}

                  <div className="mt-6">
                    <span className="mr-1">
                      {mode === "signup"
                        ? "Already a user?"
                        : "New to DevTinder?"}
                    </span>
                    <span
                      onClick={() =>
                        switchMode(mode === "signup" ? "login" : "signup")
                      }
                      className="cursor-pointer font-bold hover:underline"
                    >
                      {mode === "signup" ? "Log in" : "Sign up now."}
                    </span>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
      <FooterHome />
    </>
  );
};

export default Login;
