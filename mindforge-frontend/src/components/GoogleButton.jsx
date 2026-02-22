import React from "react";
import { useAuth } from "../context/AuthContext";

const GoogleButton = () => {
  const { loginWithGoogle } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Failed to login with Google", error);
    }
  };

  return (
    <button
      onClick={handleLogin}
      className="flex items-center justify-center w-full py-3 space-x-3 transition-all duration-300 bg-white shadow-sm rounded-xl hover:shadow-md active:scale-[0.98]"
    >
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        className="w-5 h-5"
      />
      <span className="font-medium text-gray-700">Continue with Google</span>
    </button>
  );
};

export default GoogleButton;
