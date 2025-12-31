'use client';
import { useRouter } from "next/navigation"; // for programmatic navigation
import { logout } from "@/services/auth"; // Assuming you have a logout function that removes cookies or session data
import useUser from "@/hooks/useUser";

const Logout = () => {
  const router = useRouter();
  const { setUser } = useUser();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
      localStorage.removeItem("favourites");
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
      // Optionally, show an error message to the user
    }
  };

  return (
    <button
      onClick={handleLogout} // Trigger logout on button click
      className="mt-12 px-6 py-2 cursor-pointer text-gray-400 hover:text-white transition-colors duration-200 lg:text-2xl focus:outline-none focus:ring-1 focus:ring-gray-600 rounded-full p-2"
    >
      Logout
    </button>
  );
};

export default Logout;
