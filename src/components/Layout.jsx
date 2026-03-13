import Header from "./Header";
import Footer from "./Footer";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import { useEffect, useRef } from "react";
import { addRequests } from "../utils/requestsSlice";
import { addMatches } from "../utils/matchesSlice";
import {
  incrementUnread,
  markLastMessage,
  setAllUnread,
} from "../utils/unreadSlice";
import { connectSocket } from "../utils/socket";

const Layout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const requestsData = useSelector((store) => store.requests);
  const matchesData = useSelector((store) => store.matches);
  const loggedInUser = useSelector((store) => store.user);
  const loggedInUserRef = useRef(loggedInUser);
  const matchesRef = useRef(matchesData);

  useEffect(() => {
    loggedInUserRef.current = loggedInUser;
  }, [loggedInUser]);

  useEffect(() => {
    matchesRef.current = matchesData;
  }, [matchesData]);

  const getRequests = async () => {
    if (requestsData.length > 0) return;
    try {
      const res = await api.get(BASE_URL + "/user/requests/recieved", {
        withCredentials: true,
      });
      dispatch(addRequests(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  const getMatches = async () => {
    if (matchesData.length > 0) return;
    try {
      const res = await api.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });
      dispatch(addMatches(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  const getUnreadCounts = async () => {
    try {
      const res = await api.get(BASE_URL + "/chat/unread/all", {
        withCredentials: true,
      });
      dispatch(setAllUnread(res?.data?.data));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getRequests();
    getMatches();
    getUnreadCounts();
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get(BASE_URL + "/profile/view");
        dispatch(addUser(res?.data));
      } catch (err) {
        console.error(err);
      }
    };

    checkSession();
    const intervalId = setInterval(checkSession, 60000);
    return () => clearInterval(intervalId);
  }, [navigate]);

  useEffect(() => {
    const socket = connectSocket();

    const joinAllRooms = () => {
      const matches = matchesRef.current;
      if (matches?.length > 0) {
        matches.forEach((match) => {
          socket.emit("joinChat", { targetUserId: match._id });
        });
      }
    };

    socket.on("connect", () => {
      joinAllRooms();
    });

    if (socket.connected) {
      joinAllRooms();
    }

    socket.on("connect_error", (err) => {
      console.error("socket connection error:", err.message);
    });

    socket.on("disconnect", () => {});

    const handleMessage = (message) => {
      const myId = loggedInUserRef.current?._id?.toString();
      if (!myId) return;

      const senderId = message.senderId?.toString();
      const receiverId = message.receiverId?.toString();
      const currentPath = window.location.pathname;

      if (senderId === myId) {
        dispatch(
          markLastMessage({
            userId: receiverId,
            text: message.text,
            time: message.createdAt,
          }),
        );
        return;
      }

      const isInThisChat = currentPath === `/chat/${senderId}`;

      if (!isInThisChat) {
        dispatch(
          incrementUnread({
            userId: senderId,
            text: message.text,
            time: message.createdAt,
          }),
        );
      } else {
        dispatch(
          markLastMessage({
            userId: senderId,
            text: message.text,
            time: message.createdAt,
          }),
        );
      }
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
      socket.off("connect");
      socket.off("connect_error");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    const socket = connectSocket();
    if (!socket.connected || !matchesData?.length) return;

    matchesData.forEach((match) => {
      socket.emit("joinChat", { targetUserId: match._id });
    });
  }, [matchesData]);

  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
};

export default Layout;
