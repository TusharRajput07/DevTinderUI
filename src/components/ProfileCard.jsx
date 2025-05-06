import FavoriteIcon from "@mui/icons-material/Favorite";
import ClearIcon from "@mui/icons-material/Clear";

const ProfileCard = ({ userData, image }) => {
  const { firstName, lastName, bio, gender, age } = userData;
  return (
    <div className="w-80 max-w-sm bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden flex flex-col justify-between my-5">
      {/* Image */}
      <div className="h-60 w-full overflow-hidden">
        <img
          src={image}
          alt={`${name}'s profile`}
          className="object-cover w-full h-full"
        />
      </div>

      {/* Details */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {firstName + " " + lastName}, {age}
          </h2>
          <span className="text-sm text-gray-500">{gender}</span>
        </div>
        <p className="text-gray-600 text-sm">{bio}</p>
      </div>

      {/* Buttons */}
      {/* <div className="flex justify-between p-4 gap-4">
        <div className="bg-gray-400 rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl">
          <ClearIcon fontSize="large" />
        </div>
        <div className="bg-pink-300 rounded-full p-2 text-white cursor-pointer hover:text-red-300 transition-all hover:shadow-2xl">
          <FavoriteIcon fontSize="large" />
        </div>
      </div> */}
    </div>
  );
};

export default ProfileCard;
