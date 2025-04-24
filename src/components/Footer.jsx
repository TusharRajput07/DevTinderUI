const Footer = () => {
  return (
    <footer className="w-full bg-gray-900 text-gray-300 py-12 flex flex-col justify-between items-center">
      {/* Centered Logo */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">DevTinder</h2>
        <p className="text-sm text-gray-400">Find your coding match.</p>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between text-gray-400 text-sm">
        {/* Navigation Links */}
        <nav className="mb-4 md:mb-0">
          <ul className="flex space-x-6">
            <li>
              <a href="#" className="hover:text-white transition">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition">
                Contact
              </a>
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <div>© {new Date().getFullYear()} DevTinder. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default Footer;
