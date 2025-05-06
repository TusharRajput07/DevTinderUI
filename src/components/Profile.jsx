import { useEffect, useRef, useState } from "react";
import Header from "./Header";
import ProfileCard from "./profileCard";
import { useDispatch, useSelector } from "react-redux";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import Snackbar from "@mui/material/Snackbar";

const Profile = () => {
  const userData = useSelector((store) => store.user);
  const lastNameRef = useRef(null);
  const firstNameRef = useRef(null);
  const ageRef = useRef(null);
  const bioRef = useRef(null);
  const genderRef = useRef(null);
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const [openSnack, setOpenSnack] = useState(false);

  useEffect(() => {
    if (userData) {
      firstNameRef.current.value = userData.firstName || "";
      lastNameRef.current.value = userData.lastName || "";
      genderRef.current.value = userData.gender || "";
      ageRef.current.value = userData.age || "";
      bioRef.current.value = userData.bio || "";
    }
  }, [userData]);

  // UI form validation
  const validateFormData = (firstName, lastName, age, gender) => {
    if (!firstName?.trim()) return "First Name is required!";
    else if (firstName.length > 15)
      return "First Name cannot exceed 15 characters!";
    else if (!lastName?.trim()) return "Last Name is required!";
    else if (lastName.length > 15)
      return "Last Name cannot exceed 15 characters!";
    else if (!age?.trim()) return "Age is required!";
    else if (isNaN(age) || Number(age) <= 0)
      return "Age should be a valid number!";
    else if (!gender?.trim()) return "Gender is required!";
    return null;
  };

  // function to update and save user details
  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const firstName = firstNameRef?.current?.value;
    const lastName = lastNameRef?.current?.value;
    const bio = bioRef?.current?.value;
    const age = ageRef?.current?.value;
    const gender = genderRef?.current?.value;

    let response;
    response = validateFormData(firstName, lastName, age, gender);

    setErrorMessage(response);

    if (response !== null) {
      // entries not valid
      return;
    }

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/update",
        {
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value,
          gender: genderRef.current.value,
          age: ageRef.current.value,
          bio: bioRef.current.value,
        },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setOpenSnack(true);
    } catch (err) {
      let msg;

      if (typeof err.response?.data === "string") {
        msg = err.response.data;
      } else if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else {
        msg = err.message || "Something went wrong.";
      }

      setErrorMessage(msg);
    }
  };

  const handleClose = () => {
    setOpenSnack(false);
  };

  return (
    <>
      <Header />
      <div className="w-full flex bg-[#f0f0f0] pb-20 px-20 pt-10">
        {/*left container*/}
        <div className="w-full md:w-1/2 flex flex-col mt-10 md:mt-0 items-center bg-[#dedede] mr-10 py-10 rounded-2xl">
          <div className="text-xl font-semibold">
            How Others see your Profile
          </div>
          {userData ? (
            <ProfileCard
              userData={userData}
              image="https://media.istockphoto.com/id/1335941248/photo/shot-of-a-handsome-young-man-standing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=JSBpwVFm8vz23PZ44Rjn728NwmMtBa_DYL7qxrEWr38="
            />
          ) : (
            <div>Loading...</div>
          )}
          <div className="bg-pink-200 rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl w-80 mb-2">
            <FavoriteIcon fontSize="large" /> Interested
          </div>

          <div className="bg-gray-400 rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl w-80">
            <ClearIcon fontSize="large" /> Pass
          </div>
        </div>
        {/*right container*/}
        <div className="w-full md:w-1/2 flex flex-col mt-10 md:mt-0 items-center gap-4">
          <div className="text-xl font-semibold">Edit your details</div>
          <form className="w-full">
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

            <div className="w-full relative">
              <input
                ref={ageRef}
                name="user_age"
                placeholder="your age"
                className="bg-transparent border-2 border-gray-300 shadow-md rounded-full w-full p-4 mb-4"
              />
              <span className="absolute -top-2 left-3 bg-[#f0f0f0] text-xs text-gray-500 px-1">
                Age *
              </span>
            </div>

            <div className="w-full relative">
              <select
                ref={genderRef}
                name="user_gender"
                className="bg-transparent border-2 border-gray-300 shadow-md rounded-full w-full p-4 mb-4 appearance-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <span className="absolute -top-2 left-3 bg-[#f0f0f0] text-xs text-gray-500 px-1">
                Gender *
              </span>
            </div>

            <div className="w-full relative">
              <textarea
                rows={5}
                ref={bioRef}
                name="message"
                placeholder="your bio..."
                className="bg-transparent border-2 border-gray-300 shadow-md rounded-4xl w-full p-4"
              />
              <span className="absolute -top-2 left-3 bg-[#f0f0f0] text-xs text-gray-500 px-1">
                Bio *
              </span>
            </div>

            <div className="h-8 pb-2">
              <p className="text-sm text-red-600 self-start pl-2">
                {errorMessage}
              </p>
            </div>

            <button
              onClick={handleSaveDetails}
              className="bg-[#404040] text-white text-xl font-medium w-full rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r  from-[#DD8E71] to-[#7e432d] animate-gradient mt-5"
            >
              <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
                Save Details
              </div>
            </button>
          </form>
        </div>
      </div>
      <Snackbar
        open={openSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={4000}
        onClose={handleClose}
        message="Details saved successfully!"
        ContentProps={{
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        }}
      />
    </>
  );
};

export default Profile;
