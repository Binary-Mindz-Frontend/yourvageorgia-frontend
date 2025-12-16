import membership from "@/public/assets/profile/profile.jpg";
import { getCurrentUser } from "@/services/auth"; // Assuming this is the function to get the current user
import { Suspense } from "react";
import Link from "next/link";
import Logout from "./_component/Logout";

// Convert UNIX timestamp to human-readable date format
const convertTimestampToDate = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleString(); // Convert UNIX timestamp to Date string
};

// Server Component for fetching member data
const ProfilePage = async () => {
  const memberData = await getCurrentUser(); // Fetching the current user data

  // If the user is not authenticated, redirect to the login page


  // If member data is not available, return loading state
  if (!memberData) {
    return <div className="text-center text-white">Loading...</div>;
  }

  

  return (
    <div className="min-h-screen max-w-218 mx-auto text-white flex flex-col items-center justify-center px-4 lg:p-0 mt-10 lg:mt-25">
      {/* Header Info */}
      <div className="text-center mb-18">
        {/* <h1 className="text-4xl lg:text-5xl text-[#FFF] font-semibold font-serif text-center tracking-wider mb-8">
          {memberData.firstName} {memberData.lastName}
        </h1> */}
        <p className="text-xl lg:text-3xl text-[#FFFFFF]/70">
          Member Since: {convertTimestampToDate(memberData.startDate)} {/* Format the startDate */}
        </p>
      </div>

      {/* Membership Card Container */}
      <div className="relative w-full">
        {/* Background Image */}
        <div
          className="w-full h-72 lg:h-155 bg-cover bg-center rounded-xl flex flex-col justify-end items-center p-6"
          style={{
            backgroundImage: `url(${membership.src})`, // Background image
          }}
        >
          {/* Member Info On Image Bottom */}
          <h1 className="text-xl lg:text-4xl text-white font-semibold font-serif tracking-wider">
            {memberData.firstName} {memberData.lastName}
          </h1>
          <p className="text-sm lg:text-2xl text-[#FFFFFF]/80">ID: {memberData.memberShipId}</p>
          <p className="text-sm lg:text-2xl text-[#FFFFFF]/80">
            Expiry: {convertTimestampToDate(memberData.exp)} {/* Format the expiry timestamp */}
          </p>
        </div>
      </div>

      {/* Log out Button */}
      <Logout />
    </div>
  );
};

// Wrapping the component in Suspense for loading state
const ProfilePageWithSuspense = () => {
  return (
    <Suspense fallback={<div className="text-center text-white">Loading...</div>}>
      <ProfilePage />
    </Suspense>
  );
};

export default ProfilePageWithSuspense;
