import { useEffect, useState } from "react";

const HeaderHome = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-b from-[#232323]">
      <div
        className={`max-w-7xl mx-auto flex justify-between items-center py-2 md:py-4 px-5 md:px-14 transition-all duration-1000 ease-in-out delay-1000 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-20"
        }`}
      >
        {/* Logo */}
        <h1 className="text-xl md:text-2xl font-bold text-white cursor-pointer">
          DevTinder
        </h1>
      </div>
    </header>
  );
};

export default HeaderHome;
