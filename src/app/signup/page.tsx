"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "../../../utils/auth";
import { useAuth } from "../../../context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    const { error } = await signUp(email, password);
    if (error) {
      setError(error.message);
      setSuccess("");
    } else {
      setSuccess("Check your email to confirm your account.");
      setError("");
    }
  };

  if (user) router.push("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-4">MarketPalce</h1>
        <h2 className="text-xl font-semibold text-center mb-4">Sign Up</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4">{success}</p>}
        <input
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-2 mb-3 border border-gray-300 rounded"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleSignup}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Sign Up
        </button>
        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
