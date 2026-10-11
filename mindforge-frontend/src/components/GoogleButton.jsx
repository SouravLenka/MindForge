import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const getFriendlyError = (error) => {
  switch (error?.code) {
    case "auth/unauthorized-domain":
      return "This website domain is not authorized in Firebase yet. Add mindforgesolution.vercel.app under Firebase Authentication → Settings → Authorized domains.";
    case "auth/popup-blocked":
      return "Your browser blocked the Google sign-in popup. Allow popups for this site and try again.";
    case "auth/popup-closed-by-user":
      return "The sign-in window was closed before authentication finished. Please try again.";
    case "auth/cancelled-popup-request":
      return "A sign-in popup is already open. Finish that sign-in or close it before retrying.";
    case "auth/operation-not-allowed":
      return "Google sign-in is not enabled for this Firebase project. Enable Google under Firebase Authentication → Sign-in method.";
    case "auth/network-request-failed":
      return "A network error interrupted sign-in. Check your connection and try again.";
    default:
      return "Google sign-in failed. Check the Firebase Authentication settings and try again.";
  }
};

const GoogleButton = () => {
  const { loginWithGoogle } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleLogin = async () => {
    setErrorMessage("");
    setIsSigningIn(true);
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error("Google sign-in failed:", error?.code, error?.message);
      setErrorMessage(getFriendlyError(error));
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={handleLogin}
        disabled={isSigningIn}
        aria-busy={isSigningIn}
        className="flex items-center justify-center w-full py-3 space-x-3 transition-all duration-300 bg-white shadow-sm rounded-xl hover:shadow-md active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait"
      >
        <img
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
          alt=""
          aria-hidden="true"
          className="w-5 h-5"
        />
        <span className="font-medium text-gray-700">
          {isSigningIn ? "Connecting to Google..." : "Continue with Google"}
        </span>
      </button>
      {errorMessage && (
        <p role="alert" className="text-sm leading-relaxed text-red-300">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default GoogleButton;
