const MatchCard = ({ userData }) => {
  const { firstName, lastName, age, gender, bio, image } = userData;
  return (
    <div className="w-1/2 flex items-center bg-[#dedede] rounded-2xl mb-5 p-2">
      <div className="h-28 overflow-hidden">
        <img
          className="object-cover w-full h-full rounded-xl"
          src="https://media.istockphoto.com/id/1335941248/photo/shot-of-a-handsome-young-man-standing-against-a-grey-background.jpg?s=612x612&w=0&k=20&c=JSBpwVFm8vz23PZ44Rjn728NwmMtBa_DYL7qxrEWr38="
        />
      </div>
      <div className="px-4 w-full text-gray-700">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold mb-1">
            {firstName + " " + lastName}, {age}
          </div>
          <div>{gender}</div>
        </div>
        <div className="text-sm">{bio}</div>
      </div>
    </div>
  );
};

export default MatchCard;
