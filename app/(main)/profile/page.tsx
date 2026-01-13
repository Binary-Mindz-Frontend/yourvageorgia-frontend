import membership from "@/public/assets/profile/profile.jpg";
import { getCurrentUser } from "@/services/auth";
import { Suspense } from "react";
import Logout from "./_component/Logout";
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
    // Middleware handles redirection, but we keep a safe fallback for type safety
    return <BeautifulLoader fullScreen text="Session Expired" />;
  }



  return (
    <div className="min-h-screen max-w-218 mx-auto text-white flex flex-col items-center justify-center px-4 lg:p-0 mt-10 lg:mt-25">
      {/* Header Info */}
      <div className="text-center mb-18">
        <p className="lg:text-2xl text-[#FFFFFF]/70">
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
            Expiry: {formatExpiryDate(memberData.endDate)}
          </p>
        </div>
      </div>

      {/* Log out Button */}


      {/* <div className="mt-6">
        <Button asChild className="flex items-center gap-2">
          <a href={`${apiUrl}/wallet/membership?token=${memberData.accessToken}`} target="_blank"> */}
      {/* Add the Image component here */}
      {/* <Image
              src={appleWallet}
              alt="Apple Wallet"
              width={20}
              height={20}
              
            />
            Add to Apple Wallet
          </a> */}
      {/* </Button>
      </div> */}

      <Logout />


    </div>
  );
};

import { BeautifulLoader } from "@/components/Shared/Loading/BeautifulLoader";

// Wrapping the component in Suspense for loading state
const ProfilePageWithSuspense = () => {
  return (
    <Suspense fallback={<BeautifulLoader fullScreen text="Loading Profile" />}>
      <ProfilePage />
    </Suspense>
  );
};

export default ProfilePageWithSuspense;
