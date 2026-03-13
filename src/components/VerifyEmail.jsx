import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying");

  useEffect(() => {
    const verify = async () => {
      try {
        await api.get(BASE_URL + "/verify-email/" + token);
        // success — go to login
        navigate("/login?verified=true");
      } catch (err) {
        // only show error if it's a real 400/404, not a redirect side effect
        if (err.response?.status === 400 || err.response?.status === 404) {
          setStatus("error");
        } else {
          // for anything else, assume success and redirect
          navigate("/login?verified=true");
        }
      }
    };

    if (token) verify();
  }, [token]);

  return (
    <div className="min-h-screen bg-[#291424] flex items-center justify-center text-[#f0f0f0]">
      <div className="text-center px-6">
        {status === "verifying" && (
          <>
            <div className="text-5xl mb-4">⏳</div>
            <div className="text-xl font-semibold">Verifying your email...</div>
            <div className="text-sm text-[#9a8a95] mt-2">Please wait...</div>
          </>
        )}
        {status === "error" && (
          <>
            <div className="text-5xl mb-4">❌</div>
            <div className="text-xl font-semibold text-red-400">
              Invalid or expired verification link.
            </div>
            <div className="text-sm text-[#9a8a95] mt-2">
              Please sign up again to get a new verification email.
            </div>
            <button
              onClick={() => navigate("/login")}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-[#753762] to-[#4b1745] text-white rounded-full hover:opacity-90 transition"
            >
              Go to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
