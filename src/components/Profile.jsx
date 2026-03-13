import { useEffect, useRef, useState } from "react";
import ProfileCard from "./ProfileCard";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/axios";
import { BASE_URL } from "../utils/constants";
import { addUser } from "../utils/userSlice";
import Snackbar from "@mui/material/Snackbar";
import CircularProgress from "@mui/material/CircularProgress";
import { storage } from "../utils/firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { removeUser } from "../utils/userSlice";
import SignoutDialog from "./SignoutDialog";
import DeleteAccountDialog from "./DeleteAccountDialog";
import { resetFeed } from "../utils/feedSlice";
import { resetMatches } from "../utils/matchesSlice";
import { disconnectSocket } from "../utils/socket";
import { resetUnread } from "../utils/unreadSlice";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

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
  const [isVisible, setIsVisible] = useState(false);
  const [generatingBio, setGeneratingBio] = useState(false);
  const [saving, setSaving] = useState(false);

  const [photoFiles, setPhotoFiles] = useState([null, null, null]);
  const [photoPreviews, setPhotoPreviews] = useState(["", "", ""]);

  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  const hasInitialized = useRef(false);

  useEffect(() => {
    if (userData && !hasInitialized.current) {
      hasInitialized.current = true;
      setFirstName(userData.firstName || "");
      setLastName(userData.lastName || "");
      setGender(userData.gender || "");
      setAge(userData.age || "");
      setBio(userData.bio || "");
      setSkills(userData.skills || "");
      setHobbies(userData.hobbies || "");
      setUserLocation(userData.userLocation || "");
      setPhotoPreviews([
        userData.photos?.[0] || "",
        userData.photos?.[1] || "",
        userData.photos?.[2] || "",
      ]);
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

  const uploadImage = async (file, path) => {
    const storageRef = ref(storage, path);
    const uploadTask = await uploadBytesResumable(storageRef, file);
    return await getDownloadURL(uploadTask.ref);
  };

  const handleSaveDetails = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const error = validateFormData(firstName, lastName, age, gender);
    if (error) {
      setErrorMessage(error);
      return;
    }

    setSaving(true);
    try {
      const existingPhotos = userData.photos || [];
      const finalPhotos = [...existingPhotos];

      for (let i = 0; i < 3; i++) {
        if (photoFiles[i]) {
          const url = await uploadImage(
            photoFiles[i],
            `profilePictures/${userData._id}_${i}`,
          );
          finalPhotos[i] = url;
        }
      }

      const photos = finalPhotos.filter(Boolean);

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
          userLocation,
          photos,
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
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateBio = async () => {
    if (!skills && !hobbies) {
      setErrorMessage(
        "Please fill in your skills or hobbies first so AI can generate a bio.",
      );
      return;
    }
    setGeneratingBio(true);
    setErrorMessage("");
    try {
      const res = await api.post(
        BASE_URL + "/ai/generate-bio",
        { skills, hobbies, firstName },
        { withCredentials: true },
      );
      setBio(res?.data?.bio || "");
      setSnackMessage("Bio generated! Feel free to edit it.");
      setOpenSnack(true);
    } catch (err) {
      setErrorMessage("Failed to generate bio. Please try again.");
    } finally {
      setGeneratingBio(false);
    }
  };

  const handleClose = () => setOpenSnack(false);
  const [openDialog, setOpenDialog] = useState(false);
  const handleDialog = () => setOpenDialog(!openDialog);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const handleDeleteDialog = () => setOpenDeleteDialog(!openDeleteDialog);

  const handleDeleteAccount = async () => {
    try {
      await api.delete(BASE_URL + "/profile/delete", { withCredentials: true });
      dispatch(removeUser());
      dispatch(resetFeed());
      dispatch(resetMatches());
      dispatch(resetUnread());
      disconnectSocket();
      window.location.href = "/login";
    } catch (err) {
      setOpenDeleteDialog(false);
      setSnackMessage("Failed to delete account. Please try again.");
      setOpenSnack(true);
    }
  };

  const handleImageChange = (e, slot) => {
    const file = e.target.files[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setPhotoFiles((prev) => {
      const next = [...prev];
      next[slot] = file;
      return next;
    });
    setPhotoPreviews((prev) => {
      const next = [...prev];
      next[slot] = preview;
      return next;
    });
  };

  const handleSignOut = async () => {
    try {
      await api.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(resetFeed());
      dispatch(resetMatches());
      dispatch(resetUnread());
      disconnectSocket();
      window.location.href = "/login";
    } catch (err) {
      window.location.href = "/error";
    }
  };

  const PhotoSlot = ({ slot, isMain }) => (
    <div
      className={`relative flex flex-col items-center ${isMain ? "mb-2" : ""}`}
    >
      {isMain ? (
        <>
          {photoPreviews[0] ? (
            <img
              src={photoPreviews[0]}
              alt="Main"
              className="w-32 h-32 rounded-full object-cover mb-2"
            />
          ) : (
            <div className="w-32 h-32 rounded-full flex items-center justify-center mb-2 bg-[#1e0f1a]">
              <AddPhotoAlternateOutlinedIcon
                fontSize="large"
                className="text-[#7b7b7b]"
              />
            </div>
          )}
          <label
            htmlFor="photoInput_0"
            className="cursor-pointer bg-[#7b7b7b] hover:bg-[#9f9e9e] text-white rounded-full shadow-md transition-colors duration-200 absolute bottom-0 translate-x-10 p-2"
          >
            <EditIcon className="text-white" />
          </label>
          <input
            id="photoInput_0"
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, 0)}
            className="absolute opacity-0 -z-10 w-full h-full"
          />
        </>
      ) : (
        <div className="w-full h-32 rounded-2xl overflow-hidden border-2 border-dashed border-[#555555] flex items-center justify-center bg-[#1e0f1a] relative">
          {photoPreviews[slot] ? (
            <img
              src={photoPreviews[slot]}
              alt={`Photo ${slot + 1}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-[#7b7b7b]">
              <AddPhotoAlternateOutlinedIcon fontSize="large" />
              <span className="text-xs mt-1">Add photo</span>
            </div>
          )}
          <label
            htmlFor={`photoInput_${slot}`}
            className="cursor-pointer bg-[#7b7b7b] hover:bg-[#9f9e9e] text-white rounded-full shadow-md transition-colors duration-200 absolute bottom-2 right-2 p-1.5"
          >
            <EditIcon fontSize="small" className="text-white" />
          </label>
          <input
            id={`photoInput_${slot}`}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageChange(e, slot)}
            className="absolute opacity-0 -z-10 w-full h-full"
          />
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="w-full flex flex-col-reverse md:flex-row bg-[#291424] text-[rgb(240,240,240)] pb-10 md:pb-20 px-6 md:px-20 pt-0 md:pt-10">
        {/* Preview */}
        <div
          className={`w-full md:w-1/2 mr-10 mt-10 md:mt-0 transition-all duration-700 ease-in-out ${!isVisible ? "opacity-0 -translate-x-20" : "opacity-100 translate-x-0"}`}
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

        {/* Form */}
        <div
          className={`w-full md:w-1/2 mt-10 md:mt-0 transition-all duration-700 ease-in-out delay-300 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-20"}`}
        >
          <div className="w-full flex flex-col items-center gap-4">
            <div className="text-xl font-semibold">Edit your details</div>
            <PhotoSlot slot={0} isMain={true} />

            <form className="w-full" autoComplete="off">
              <div className="w-full relative">
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="your first name"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  First Name *
                </span>
              </div>
              <div className="w-full relative">
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="your last name"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Last Name *
                </span>
              </div>
              <div className="w-full relative">
                <input
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="your age"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Age *
                </span>
              </div>
              <div className="w-full relative">
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
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
              <div className="w-full relative">
                <input
                  value={userLocation}
                  onChange={(e) => setUserLocation(e.target.value)}
                  placeholder="your current location"
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-full w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Location *
                </span>
              </div>
              <div className="w-full relative">
                <textarea
                  rows={2}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="your professional skills..."
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-4xl w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Skills *
                </span>
              </div>
              <div className="w-full relative">
                <textarea
                  rows={2}
                  value={hobbies}
                  onChange={(e) => setHobbies(e.target.value)}
                  placeholder="your hobbies beyond work..."
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-4xl w-full p-4 mb-4"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Hobbies *
                </span>
              </div>
              <div className="w-full relative">
                <textarea
                  rows={5}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="your bio..."
                  className="bg-transparent border-2 border-[#555555] shadow-md rounded-4xl w-full p-4 mb-2"
                />
                <span className="absolute -top-2 left-3 bg-[#291424] text-xs text-[#7b7b7b] px-1">
                  Bio *
                </span>
                <button
                  type="button"
                  onClick={handleGenerateBio}
                  disabled={generatingBio}
                  className="flex items-center gap-2 px-4 py-2 mb-4 rounded-full border border-[#c084fc] text-[#c084fc] hover:bg-[#c084fc] hover:text-white disabled:opacity-50 transition-all duration-200 text-sm font-medium cursor-pointer"
                >
                  <AutoAwesomeIcon style={{ fontSize: 16 }} />
                  {generatingBio ? "Generating..." : "Generate bio with AI"}
                </button>
              </div>

              <div className="w-full">
                <p className="text-sm text-[#7b7b7b] mb-3">
                  Add more photos (optional)
                </p>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <PhotoSlot slot={1} isMain={false} />
                  </div>
                  <div className="flex-1">
                    <PhotoSlot slot={2} isMain={false} />
                  </div>
                </div>
              </div>

              <div className="h-8 pb-2">
                <p className="text-sm text-red-600 self-start pl-2">
                  {errorMessage}
                </p>
              </div>

              <button
                onClick={handleSaveDetails}
                disabled={saving}
                className="bg-[#404040] text-white text-xl font-medium w-full rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r from-[#753762] to-[#4b1745] animate-gradient mt-5 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <div className="px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out gap-3">
                  {saving ? (
                    <>
                      <CircularProgress size={20} style={{ color: "white" }} />
                      Saving...
                    </>
                  ) : (
                    "Save Details"
                  )}
                </div>
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="w-full bg-[#291424] flex justify-center items-center gap-4 pb-5 px-5 md:px-0">
        <button
          onClick={handleDialog}
          className="bg-[#404040] text-white text-xl font-medium w-1/2 md:w-1/4 rounded-full cursor-pointer hover:shadow-lg"
        >
          <div className="px-2 md:px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out text-sm md:text-xl">
            Signout{" "}
            <LogoutIcon className="text-white hover:text-[#747474] ml-2" />
          </div>
        </button>
        <button
          onClick={handleDeleteDialog}
          className="bg-red-800 text-white text-xl font-medium w-1/2 md:w-1/4 rounded-full cursor-pointer hover:shadow-lg hover:bg-red-700"
        >
          <div className="px-2 md:px-10 py-4 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out text-sm md:text-xl">
            Delete Account
            <DeleteOutlineIcon className="text-white hover:text-[#747474] ml-0 md:ml-1" />
          </div>
        </button>
      </div>

      <SignoutDialog
        open={openDialog}
        handleDialog={handleDialog}
        handleSignOut={handleSignOut}
      />
      <DeleteAccountDialog
        open={openDeleteDialog}
        handleDialog={handleDeleteDialog}
        handleDeleteAccount={handleDeleteAccount}
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
