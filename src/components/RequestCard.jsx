import axios from "axios";
import defaultProfile from "../assets/defaultProfile.webp";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeRequest } from "../utils/requestsSlice";

const RequestCard = ({ userData }) => {
  const { firstName, lastName, age, gender, bio, photoURL } =
    userData?.fromUserId;
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    console.log("called");
    try {
      const res = await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );
      console.log(res?.data);
      dispatch(removeRequest(_id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="w-1/2  bg-[#dedede] rounded-2xl mb-5 p-2">
      <div className="flex items-center">
        <div className="h-28 w-28 overflow-hidden">
          {photoURL ? (
            <img
              className="object-cover w-full h-full rounded-xl"
              src={photoURL}
            />
          ) : (
            <img
              className="object-cover w-full h-full rounded-xl"
              src={defaultProfile}
            />
          )}
        </div>
        <div className="px-4 w-full text-gray-700">
          <div className="flex justify-between items-center">
            <div className="text-xl font-semibold mb-1">
              {firstName + " " + lastName}
              {age ? ", " + age : ""}
            </div>
            <div>{gender}</div>
          </div>
          <div className="text-sm">{bio}</div>
        </div>
      </div>

      <div className="flex justify-center py-2">
        <div className="bg-[#404040] text-white text-base font-medium w-fit rounded-2xl cursor-pointer hover:shadow-lg bg-gradient-to-r  from-[#DD8E71] to-[#7e432d] animate-gradient mx-2">
          <div
            onClick={() => reviewRequest("accepted", userData?._id)}
            className="px-10 py-2 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out"
          >
            Confirm
          </div>
        </div>
        <div
          onClick={() => reviewRequest("rejected", userData?._id)}
          className="bg-[#404040] text-white text-base font-medium w-fit rounded-2xl cursor-pointer hover:shadow-lg mx-2"
        >
          <div className="px-10 py-2 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
            Delete
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestCard;
