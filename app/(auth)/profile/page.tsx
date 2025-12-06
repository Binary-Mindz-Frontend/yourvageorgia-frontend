import membership from "@/public/assets/profile/profile.jpg";
import Link from "next/link";

const ProfilePage = () => {
  const memberData = {
    name: "Georgia Cowdry",
    memberSince: "20 Nov 2025",
    cardName: "Member Name",
    id: "12345678",
    expiry: "20 October 2026",
    company: "Solenne.",
    title: "Membership Card",
  };
  return (
    <div className="min-h-screen max-w-[872px] mx-auto text-white flex flex-col items-center justify-center px-4 lg:p-0 mt-10 lg:mt-25 ">
      {/* Header Info */}
      <div className="text-center mb-18">
        <h1 className="text-4xl lg:text-5xl text-[#FFF] font-semibold font-serif text-center tracking-wider mb-8">
          {memberData.name}
        </h1>
        <p className="text-xl lg:text-3xl text-[#FFFFFF]/70">
          Member Since: {memberData.memberSince}
        </p>
      </div>

      {/* Membership Card Container */}
      <div className="relative w-full">
        {/* Background Image */}
        <div
          className="w-full h-[290px] lg:h-[620px] bg-cover bg-center rounded-xl flex flex-col justify-end items-center p-6"
          style={{
            backgroundImage: `url(${membership.src})`,
          }}
        >
          {/* Member Info On Image Bottom */}
          <h1 className="text-xl lg:text-4xl  text-white font-semibold font-serif tracking-wider">
            {memberData.name}
          </h1>
          <p className="text-sm lg:text-2xl text-[#FFFFFF]/80">ID: {memberData.id}</p>
          <p className="text-sm lg:text-2xl text-[#FFFFFF]/80">
           Expiry: {memberData.expiry}
          </p>
        </div>
      </div>

      {/* Log out Button */}
      <Link href="/">
        <button className="mt-12 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 lg:text-2xl focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-md p-2">
          Logout
        </button>
      </Link>
    </div>
  );
};

export default ProfilePage;
