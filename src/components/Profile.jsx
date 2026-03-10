import { useEffect, useState } from "react";
import ProfileCard from "./profileCard";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import Snackbar from "@mui/material/Snackbar";
import { storage } from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import { removeUser } from "../utils/userSlice";
import SignoutDialog from "./SignoutDialog";
import { resetFeed } from "../utils/feedSlice";
import { resetMatches } from "../utils/matchesSlice";
import { disconnectSocket } from "../utils/socket";

const Profile = () => {
  const userData = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [hobbies, setHobbies] = useState("");
  const [userLocation, setUserLocation] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [openSnack, setOpenSnack] = useState(false);
  const [snackMessage, setSnackMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  useEffect(() => {
    if (userData) {
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setGender(userData.gender || "");
      setAge(userData.age || "");
      setBio(userData.bio || "");
      setSkills(userData.skills || "");
      setHobbies(userData.hobbies || "");
      setUserLocation(userData.userLocation || "");
      setImagePreview(userData?.photoURL);
    }
  }, [userData]);

  const validateFormData = (firstName, lastName, age, gender) => {
    if (!firstName?.trim()) return "First Name is required!";
    if (firstName.length > 15) return "First Name cannot exceed 15 characters!";
    if (!lastName?.trim()) return "Last Name is required!";
    if (lastName.length > 15) return "Last Name cannot exceed 15 characters!";
    if (isNaN(age) || Number(age) <= 18) return "Age should be above 18!";
    if (!gender?.trim()) return "Gender is required!";
    return null;
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSnackMessage("Saving...Please wait.");
    setOpenSnack(true);

    const error = validateFormData(firstName, lastName, age, gender);
    if (error) {
      setErrorMessage(error);
      return;
    }

    let imageURL = userData.photoURL || "";
    if (imageFile) {
      try {
        const storageRef = ref(storage, `profilePictures/${userData._id}`);
        const uploadTask = await uploadBytesResumable(storageRef, imageFile);
        imageURL = await getDownloadURL(uploadTask.ref);
      } catch (err) {
        console.error("Image upload error:", err);
        setErrorMessage("Failed to upload image.");
        return;
      }
    }

    try {
      const res = await api.patch(
        BASE_URL + "/profile/update",
        {
          firstName,
          lastName,
          gender,
          age,
          bio,
          skills,
          hobbies,
          userLocation: userLocation,
          photoURL: imageURL,
        },
        { withCredentials: true },
      );

      dispatch(addUser(res?.data?.data));
      setSnackMessage("Details saved successfully!");
      setOpenSnack(true);
    } catch (err) {
      const msg =
        typeof err.response?.data === "string"
          ? err.response.data
          : err.response?.data?.message ||
            err.message ||
            "Something went wrong.";
      setErrorMessage(msg);
    }
  };

  const handleClose = () => {
    setOpenSnack(false);
  };

  const [openDialog, setOpenDialog] = useState(false);
  const handleDialog = () => {
    setOpenDialog(!openDialog);
  };

  const handleImageChange = (e) => {
    console.log("image change");

    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSignOut = async () => {
    try {
      await api.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(resetFeed());
      dispatch(resetMatches());
      disconnectSocket();
      window.location.href = "/login";
    } catch (err) {
      window.location.href = "/error";
    }
  };

  return (
    <>
      <div className="w-full flex flex-col-reverse md:flex-row bg-[#291424] text-[rgb(240,240,240)] pb-10 md:pb-20 px-6 md:px-20 pt-0 md:pt-10">
        <div
          className={`w-full md:w-1/2 mr-10 mt-10 md:mt-0 transition-all duration-700 ease-in-out ${
            !isVisible
              ? "opacity-0 -translate-x-20"
              : "opacity-100 translate-x-0"
          }`}
        >
          <div className="w-full flex flex-col items-center bg-[#291424] rounded-2xl pt-1">
            <div className="text-lg md:text-xl font-semibold mb-3">
              How Others see your Profile
            </div>
            {userData ? (
              <ProfileCard userData={userData} />
            ) : (
              <div className="pt-5">Loading...</div>
            )}
          </div>
        </div>

        <div
          className={`w-full md:w-1/2 mt-10 md:mt-0 transition-all duration-700 ease-in-out delay-300 ${
            isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"
          }`}
        >
          <div className="w-full flex flex-col items-center gap-4">
            <div className="text-xl font-semibold">Edit your details</div>

            <div className="relative w-full flex flex-col items-center mb-2">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-32 h-32 rounded-full object-cover mb-2"
                />
              ) : (
                <div className="w-32 h-32 rounded-full flex items-center justify-center mb-2">
                  <img
                    src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    className="w-full h-full rounded-2xl"
                  />
                </div>
              )}
              <label
                htmlFor="profileImageInput"
                className="cursor-pointer text-sm bg-[#7b7b7b] hover:bg-[#9f9e9e] text-white font-semibold rounded-full shadow-md transition-colors ease-in-out duration-200 absolute bottom-0 translate-x-10 p-2"
              >
                <EditIcon className="text-white" />
              </label>
              <input
                id="profileImageInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute opacity-0 -z-10 w-full h-full"
              />
            </div>

            <form className="w-full">
              {/* First Name */}
              <div className="w-full relative">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  name="user_first_name"
                  placeholder="your first name"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  First Name *
                </span>
              </div>

              {/* Last Name */}
              <div className="w-full relative">
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  name="user_last_name"
                  placeholder="your last name"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Last Name *
                </span>
              </div>

              {/* Age */}
              <div className="w-full relative">
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  name="user_age"
                  placeholder="your age"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Age *
                </span>
              </div>

              {/* Gender */}
              <div className="w-full relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  name="user_gender"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4 appearance-none"
                >
                  <option value="" disabled>
                    Select your gender
                  </option>
                  <option value="male" className="text-black">
                    Male
                  </option>
                  <option value="female" className="text-black">
                    Female
                  </option>
                  <option value="other" className="text-black">
                    Other
                  </option>
                </select>
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Gender *
                </span>
              </div>

              {/* location */}
              <div className="w-full relative">
                <input
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  name="user_location"
                  placeholder="your current location"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Location *
                </span>
              </div>

              {/* Skills */}
              <div className="w-full relative">
                <textarea
                  rows={2}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  name="user_skills"
                  placeholder="your professional skills..."
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-4xl w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Skills *
                </span>
              </div>

              {/* Hobbies */}
              <div className="w-full relative">
                <textarea
                  rows={2}
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  name="user_hobbies"
                  placeholder="your hobbies beyond work..."
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-4xl w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Hobbies *
                </span>
              </div>

              {/* Bio */}
              <div className="w-full relative">
                <textarea
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  name="user_bio"
                  placeholder="your bio..."
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-4xl w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
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
                className="bg-[#404040] text-white text-xl font-medium w-full rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r  from-[#753762] to-[#4b1745] animate-gradient mt-5"
              >
                <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
                  Save Details
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#291424] flex justify-center items-center pb-5">
        <button
          onClick={handleDialog}
          className="bg-[#404040] text-white text-xl font-medium w-1/2 md:w-1/3 rounded-full cursor-pointer hover:shadow-lg"
        >
          <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
            Signout
            <LogoutIcon className="text-[#b5b3b3] hover:text-[#747474] ml-2" />
          </div>
        </button>
      </div>

      <SignoutDialog
        open={openDialog}
        handleDialog={handleDialog}
        handleSignOut={handleSignOut}
      />

      <Snackbar
        open={openSnack}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={7000}
        onClose={handleClose}
        message={snackMessage}
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
