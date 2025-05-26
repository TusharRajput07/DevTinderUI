const FooterHome = () => {
  return (
    <footer className="w-full bg-[#1e0619] bg-gradient-to-t from-black text-[#d0d0d0] py-12 flex flex-col justify-between items-center">
      {/* Centered Logo */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white">DevTinder</h2>
        <p className="text-sm">Find your coding match.</p>
      </div>

      {/* Bottom Section */}
      <div className="w-full max-w-7xl px-6 flex flex-col md:flex-row items-center justify-center md:justify-end text-sm">
        {/* Copyright */}
        <div>© {new Date().getFullYear()} DevTinder. All rights reserved.</div>
      </div>
    </footer>
  );
};

export default FooterHome;
