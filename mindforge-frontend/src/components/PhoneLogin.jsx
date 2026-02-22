import React, { useState, useEffect } from "react";
import { 
  RecaptchaVerifier, 
  signInWithPhoneNumber 
} from "firebase/auth";
import { auth } from "../firebase/firebaseConfig";

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      });
    }
  }, []);

  const onHandleSendOTP = async () => {
    if (!phoneNumber) return setError("Please enter a phone number");
    setLoading(true);
    setError("");
    
    // Ensure phone number has country code
    const fullPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;

    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
      setConfirmationResult(confirmation);
    } catch (err) {
      console.error("SMS error", err);
      setError("Failed to send OTP. Try again.");
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOTP = async () => {
    if (!otp) return setError("Please enter OTP");
    setLoading(true);
    setError("");

    try {
      await confirmationResult.confirm(otp);
      // Auth state will be updated by onAuthStateChanged in AuthContext
    } catch (err) {
      setError("Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {!confirmationResult ? (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="tel"
              placeholder="+91 Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-3 border glass-input rounded-xl focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={onHandleSendOTP}
            disabled={loading}
            className="flex items-center justify-center w-full py-3 space-x-2 text-white transition-all duration-300 btn-purple-gradient rounded-xl disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Sending...</span>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-semibold">Send OTP</span>
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter 6-digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-3 border glass-input rounded-xl focus:ring-2 focus:ring-purple-500"
          />
          <button
            onClick={onVerifyOTP}
            disabled={loading}
            className="w-full py-3 text-white transition-all duration-300 btn-purple-gradient rounded-xl"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
          <button 
            onClick={() => setConfirmationResult(null)}
            className="w-full text-sm text-center text-purple-300 hover:text-white"
          >
            Change Phone Number
          </button>
        </div>
      )}
      
      {error && <p className="text-xs text-center text-red-400">{error}</p>}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default PhoneLogin;
