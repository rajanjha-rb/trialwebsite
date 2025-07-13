"use client";

import React from "react";
import { useAuthStore } from "../../../store/auth";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FaEye, FaEyeSlash, FaEnvelope, FaLock, FaUser, FaGlobe } from "react-icons/fa";

const PALETTE = {
  blue: "#0057B7",
  red: "#D72631", 
  gold: "#FFD166",
  white: "#F8F9FA",
  gray: "#495057",
};

export default function Register() {
  const { login, createAccount } = useAuthStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    if (!name || !email || !password) {
      setError("Please fill out all fields");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // First create the account
      const response = await createAccount(
        name.toString(),
        email.toString(),
        password.toString()
      );

      if (response.error) {
        setError(response.error.message);
        setIsLoading(false);
        return;
      }

      // Add a small delay to ensure account creation is complete
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Then attempt to login
      const loginResponse = await login(email.toString(), password.toString());
      if (loginResponse.error) {
        setError(`Account created successfully, but login failed: ${loginResponse.error.message}. Please try logging in manually.`);
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-gold-50 p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gold-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-red-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaGlobe className="text-3xl" style={{ color: PALETTE.blue }} />
            <div className="flex items-center gap-1">
              <span className="text-3xl font-bold italic" style={{ color: PALETTE.blue }}>Brothers</span>
              <span className="text-3xl font-bold italic" style={{ color: PALETTE.red }}>Holidays</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm">Join us for unforgettable adventures</p>
        </div>

        {/* Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h2>
            <p className="text-gray-600 text-sm">
              Already have an account?{" "}
              <Link href="/login" className="font-semibold hover:underline transition-colors" style={{ color: PALETTE.blue }}>
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Full Name
                </Label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="Enter your email"
                    className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="pl-10 pr-12 h-12 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={isLoading}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: `linear-gradient(135deg, ${PALETTE.blue} 0%, ${PALETTE.red} 100%)`,
                boxShadow: "0 4px 15px rgba(0, 87, 183, 0.3)",
              }}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
