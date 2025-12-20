import membership from "@/public/assets/profile/profile.jpg";
import { getCurrentUser } from "@/services/auth";
import { Suspense } from "react";
import Logout from "./_component/Logout";
import { Button } from "@/components/ui/button";
import Link from "next/link";
const apiUrl = process.env.NEXT_PUBLIC_BASE_API;
// Convert UNIX timestamp to date-only format (no time)
const convertTimestampToDateOnly = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Format for expiry date if you want a different format
const formatExpiryDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Server Component for fetching member data
const ProfilePage = async () => {
  const memberData = await getCurrentUser();

  if (!memberData) {
    return <div className="text-center text-white">Loading...</div>;
  }

  return (
    <div className="min-h-screen max-w-218 mx-auto text-white flex flex-col items-center justify-center px-4 lg:p-0 mt-10 lg:mt-25">
      {/* Header Info */}
      <div className="text-center mb-18">
        <p className="text-xl lg:text-3xl text-[#FFFFFF]/70">
          Member Since: {convertTimestampToDateOnly(memberData.startDate)}
        </p>
      </div>

      {/* Membership Card Container */}
      <div className="relative w-full">
        {/* Background Image */}
        <div
          className="w-full h-72 lg:h-155 bg-cover bg-center rounded-xl flex flex-col justify-end items-center p-6"
          style={{
            backgroundImage: `url(${membership.src})`,
          }}
        >
          {/* Member Info On Image Bottom */}
          <h1 className="text-xl lg:text-4xl text-white font-semibold font-serif tracking-wider">
            {memberData.firstName} {memberData.lastName}
          </h1>
          <p className="text-sm lg:text-2xl text-[#FFFFFF]/80">ID: {memberData.memberShipId}</p>
          <p className="text-sm lg:text-2xl text-[#FFFFFF]/80">
            Expiry: {formatExpiryDate(memberData.exp)}
          </p>
        </div>
      </div>

      {/* Log out Button */}


      <div className="mt-6">
        <Button asChild>
          <Link href={`${apiUrl}/wallet/membership`}>Add to Apple Wallet</Link>
        </Button>
      </div>

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