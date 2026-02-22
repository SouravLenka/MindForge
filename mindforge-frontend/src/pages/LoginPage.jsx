import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GoogleButton from "../components/GoogleButton";
import "./Login.css";

const LoginPage = () => {
  const { user, loading } = useAuth();

  // Redirect to home if already logged in
  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-mesh-gradient">
      {/* Wave Background elements */}
      <div className="wave-container">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8 text-white">
          <div className="flex items-center justify-center p-3 mb-4 bg-purple-600 rounded-full shadow-lg shadow-purple-500/30">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-10 h-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">MindForge</h1>
        </div>

        {/* Login Card */}
        <div className="p-8 glass-card rounded-2xl">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-white">Welcome to MindForge</h2>
            <p className="mt-2 text-sm text-purple-200/70">
              Sign in to start resolving your doubts
            </p>
          </div>

          <div className="space-y-6">
            <GoogleButton />
          </div>
        </div>

        {/* Footer Text */}
        <div className="mt-8 text-center text-white/40">
          <p className="px-10 text-[10px] leading-relaxed">
            By continuing, you agree to our <span className="underline cursor-pointer hover:text-white/60">Terms of Service</span> and <span className="underline cursor-pointer hover:text-white/60">Privacy Policy</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
