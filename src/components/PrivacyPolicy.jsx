import { useEffect, useState } from "react";
import HeaderHome from "./HeaderHome";
import FooterHome from "./FooterHome";

const sections = [
  {
    title: "Information We Collect",
    content: `When you create a DevTinder account, we collect your name, email address, and password. As you build your profile, we also store optional information such as your age, gender, location, bio, skills, hobbies, and profile photos. We collect messages you send to your matches and interaction data such as likes and passes.`,
  },
  {
    title: "How We Use Your Information",
    content: `We use your information to operate and improve DevTinder. This includes showing your profile to other users, matching you with developers, enabling real-time chat, and sending transactional emails such as email verification and password resets. We do not sell your data to third parties or use it for advertising.`,
  },
  {
    title: "Profile Visibility",
    content: `Your profile — including your name, photo, bio, skills, hobbies, and location — is visible to other registered users of DevTinder. Your email address and password are never visible to other users. You can update or delete your profile information at any time from the Profile page.`,
  },
  {
    title: "Photos",
    content: `Profile photos you upload are stored securely on Firebase Storage. By uploading a photo, you confirm that you own the rights to it and that it does not violate any third-party rights. We do not use your photos for any purpose other than displaying them on your profile.`,
  },
  {
    title: "Data Security",
    content: `Your password is hashed using bcrypt and is never stored in plain text. Authentication is handled via secure HTTP-only cookies with JWT tokens. We use industry-standard practices to protect your data, but no method of transmission over the internet is 100% secure.`,
  },
  {
    title: "Account Deletion",
    content: `You can delete your account at any time from the Profile page. Upon deletion, your profile, matches, messages, and all associated data are permanently removed from our database. This action cannot be undone.`,
  },
  {
    title: "Third-Party Services",
    content: `DevTinder uses Firebase for photo storage and Nodemailer with Gmail for transactional emails. These services have their own privacy policies. We only share the minimum necessary data with these services to operate the app.`,
  },
  {
    title: "Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify users of significant changes via email or an in-app notice. Continued use of DevTinder after changes constitutes acceptance of the updated policy.`,
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy or how your data is handled, please reach out to us at support@devtinder.com.`,
  },
];

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [visibleSections, setVisibleSections] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    requestAnimationFrame(() => setIsVisible(true));
    sections.forEach((_, i) => {
      setTimeout(
        () => setVisibleSections((prev) => [...prev, i]),
        200 + i * 80,
      );
    });
  }, []);

  return (
    <>
      <HeaderHome />
      <div className="bg-[#291424] text-[#f0f0f0] w-full min-h-screen px-6 md:px-24 pb-20">
        {/* Hero */}
        <div className="flex flex-col items-center justify-center pt-20 pb-12 text-center">
          <div
            className={`transition-all duration-700 ease-in-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="text-xs uppercase tracking-widest text-[#c084fc] mb-4 font-semibold">
              Legal
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6">
              Privacy
              <br />
              <span className="bg-gradient-to-r from-[#c084fc] to-[#753762] bg-clip-text text-transparent">
                Policy
              </span>
            </h1>
            <p className="text-[#b0b0b0] text-base max-w-xl mx-auto">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          className={`w-24 h-1 bg-gradient-to-r from-[#753762] to-[#4b1745] mx-auto mb-16 rounded-full transition-all duration-700 delay-300 ${isVisible ? "opacity-100 scale-x-100" : "opacity-0 scale-x-0"}`}
        />

        {/* Sections */}
        <div className="max-w-3xl mx-auto flex flex-col gap-8">
          {sections.map((s, i) => (
            <div
              key={i}
              className={`transition-all duration-500 ease-in-out ${visibleSections.includes(i) ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              <h2 className="text-lg font-bold text-[#c084fc] mb-2">
                {i + 1}. {s.title}
              </h2>
              <p className="text-[#b0b0b0] leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>
      <FooterHome />
    </>
  );
};

export default PrivacyPolicy;
