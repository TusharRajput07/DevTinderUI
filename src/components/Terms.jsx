import { useEffect, useState } from "react";
import HeaderHome from "./HeaderHome";
import FooterHome from "./FooterHome";

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By creating an account on DevTinder, you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not use the app. We reserve the right to update these terms at any time, and continued use of DevTinder constitutes acceptance of the revised terms.`,
  },
  {
    title: "Eligibility",
    content: `You must be at least 18 years old to use DevTinder. By registering, you confirm that you are 18 or older and that the information you provide is accurate and truthful. Accounts found to belong to minors will be permanently deleted.`,
  },
  {
    title: "Your Account",
    content: `You are responsible for maintaining the security of your account and password. DevTinder is not liable for any loss or damage resulting from unauthorized access to your account. Please notify us immediately at support@devtinder.com if you suspect any unauthorized use.`,
  },
  {
    title: "Acceptable Use",
    content: `DevTinder is a professional networking platform for developers. You agree not to use the app to harass, abuse, or harm other users; post false, misleading, or offensive content; impersonate another person or entity; send spam or unsolicited messages; or engage in any activity that violates applicable laws. Violations may result in immediate account suspension or deletion.`,
  },
  {
    title: "Profile Content",
    content: `You are solely responsible for the content you post on your profile, including photos, bio, skills, and messages. By posting content, you grant DevTinder a non-exclusive license to display that content within the app. You confirm that your content does not infringe on any third-party rights and complies with our community standards.`,
  },
  {
    title: "Matching & Messaging",
    content: `DevTinder facilitates connections between developers but does not guarantee any matches or outcomes. Conversations and connections made through the app are between users directly. We are not responsible for the conduct of users outside of the platform.`,
  },
  {
    title: "Account Termination",
    content: `You may delete your account at any time from the Profile page. DevTinder reserves the right to suspend or terminate accounts that violate these terms, engage in abusive behavior, or are found to be fraudulent — without prior notice.`,
  },
  {
    title: "Disclaimer of Warranties",
    content: `DevTinder is provided "as is" without warranties of any kind. We do not guarantee that the service will be uninterrupted, error-free, or free of harmful components. Use of the app is at your own risk.`,
  },
  {
    title: "Limitation of Liability",
    content: `To the fullest extent permitted by law, DevTinder shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the app, including but not limited to loss of data, loss of revenue, or damage to relationships resulting from connections made on the platform.`,
  },
  {
    title: "Contact",
    content: `If you have questions about these Terms of Service, please contact us at support@devtinder.com.`,
  },
];

const Terms = () => {
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
              Terms of
              <br />
              <span className="bg-gradient-to-r from-[#c084fc] to-[#753762] bg-clip-text text-transparent">
                Service
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

export default Terms;
