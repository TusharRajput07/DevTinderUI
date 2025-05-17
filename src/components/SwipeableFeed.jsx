import React from "react";
import TinderCard from "react-tinder-card";
import ProfileCard from "./profileCard";

const dummyProfiles = [
  {
    _id: "1",
    firstName: "Tushar",
    lastName: "Rajput",
    age: 21,
    gender: "Male",
    photoURL: "https://your-image-url.jpg",
    bio: "Frontend developer who loves React and music.",
    skills: "React, Tailwind, Redux",
    hobbies: "Guitar, Photography, Trekking",
  },
  {
    _id: "2",
    firstName: "Sanya",
    lastName: "Sharma",
    age: 22,
    gender: "Female",
    photoURL: "",
    bio: "I design interfaces and sketch in free time.",
    skills: "Figma, UI/UX, CSS",
    hobbies: "Drawing, Reading",
  },
];

const SwipeableFeed = () => {
  const swiped = (direction, name) => {
    console.log(`You swiped ${direction} on ${name}`);
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#0F0F0F]">
      {dummyProfiles.map((user, index) => (
        <TinderCard
          key={user._id}
          onSwipe={(dir) => swiped(dir, user.firstName)}
          preventSwipe={["up", "down"]}
        >
          <div
            className="absolute"
            style={{ zIndex: dummyProfiles.length - index }}
          >
            <ProfileCard userData={user} />
          </div>
        </TinderCard>
      ))}
    </div>
  );
};

export default SwipeableFeed;
