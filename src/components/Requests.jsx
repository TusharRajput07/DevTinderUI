import axios from "axios";
import Header from "./Header";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addRequests } from "../utils/requestsSlice";
import RequestCard from "./RequestCard";
import SplitText from "./SplitText";

const Requests = () => {
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  const dispatch = useDispatch();
  const userRequests = useSelector((store) => store.requests);

  const getRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/recieved", {
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

  if (!userRequests || userRequests.length === 0) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-[#291424] text-[#f0f0f0] flex justify-center items-center px-[20vw]">
          <div
            className={`text-xl md:text-5xl font-extrabold text-center transition-all duration-700 ease-in-out delay-150 ${
              isVisible
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-20"
            }`}
          >
            <SplitText>No connection requests.</SplitText>
            <SplitText>Check back later!</SplitText>
            <SplitText className="text-3xl">
              New connection requests will appear here. ☑️
            </SplitText>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="bg-[#f0f0f0] min-h-screen">
        <div className="text-3xl font-bold text-center py-5">
          Connection Requests
        </div>
        <div className="w-full flex flex-col items-center">
          {/*cards*/}
          {userRequests.map((request) => (
            <RequestCard userData={request} key={request._id} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Requests;
