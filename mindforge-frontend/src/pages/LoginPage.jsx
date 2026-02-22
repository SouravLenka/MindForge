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
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8 text-white">
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
