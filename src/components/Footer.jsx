import { Link } from "react-router-dom";

const FooterHome = () => {
  return (
    <footer className="w-full bg-[#1e0619] bg-gradient-to-t from-black text-[#d0d0d0] py-12 flex flex-col justify-between items-center">
      {/* Centered Logo */}
      <div className="text-center mb-8">
        <h2
          onClick={() => window.location.reload()}
          className="text-2xl font-bold text-white cursor-pointer"
        >
          DevTinder
        </h2>
        <p className="text-sm">Find your coding match.</p>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-between text-sm">
        {/* Navigation Links */}
        <nav className="mb-4 md:mb-0">
          <ul className="flex space-x-6">
            <li>
              <Link to="/about" className="hover:text-white transition">
                About
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-white transition">
                Terms
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white transition">
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        {/* Copyright */}
        <div>© {new Date().getFullYear()} DevTinder. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default FooterHome;
