import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import { addRequests } from "../utils/requestsSlice";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const requestsData = useSelector((store) => store.requests);

  // gets connection requests and store them to the store
  const getRequests = async () => {
    if (requestsData.length > 0) return;
    try {
      const res = await api.get(BASE_URL + "/user/requests/recieved", {
        withCredentials: true,
      });
      console.log(res?.data?.data);
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getRequests();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get(BASE_URL + "/profile/view");
        console.log(res, "profile res");
        dispatch(addUser(res?.data));
      } catch (err) {
        console.log(err, "profile errrr");
        if (err.response?.status === 401) {
          console.warn("Session expired. Redirecting to login...");
          // navigate("/sessionExpired");
        }
      }
    };

    checkSession();
    // Run every 5 minutes
    const intervalId = setInterval(checkSession, 60000);

    return () => clearInterval(intervalId); // Cleanup when Layout unmounts
  }, [navigate]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
