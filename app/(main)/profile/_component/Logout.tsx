'use client';
import { useRouter } from "next/navigation"; // for programmatic navigation
import { logout } from "@/services/auth"; // Assuming you have a logout function that removes cookies or session data

const Logout = () => {
  const router = useRouter(); // useRouter for navigation after logout

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      // After logout, redirect to the homepage
      router.push("/"); // Navigate to the homepage
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <button
      onClick={handleLogout} // Trigger logout on button click
      className="mt-12 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 lg:text-2xl focus:outline-none focus:ring-2 focus:ring-gray-600 rounded-md p-2"
    >
      Logout
    </button>
  );
};

export default Logout;
