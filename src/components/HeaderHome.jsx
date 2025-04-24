const HeaderHome = () => {
  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-gradient-to-b from-[#a3a2a2]">
      <div className="max-w-7xl mx-auto flex justify-between items-center py-4 px-14">
        {/* Logo */}
        <h1 className="text-2xl font-bold text-gray-900">DevTinder</h1>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center space-x-6 text-gray-700 font-medium">
            <li>
              <a href="#" className="hover:text-gray-900 transition">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-gray-900 transition">
                About
              </a>
            </li>
            <div className="bg-[#404040] text-white text-base font-medium w-fit rounded-full cursor-pointer hover:shadow-lg bg-gradient-to-r  from-[#DD8E71] to-[#7e432d] animate-gradient">
              <div className="px-6 py-2 flex justify-center items-center hover:scale-[90%] transition-all duration-150 ease-in-out">
                Log in
              </div>
            </div>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default HeaderHome;
