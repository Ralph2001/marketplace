"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "../../../utils/auth";
import { useAuth } from "../../../context/AuthContext";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";

const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export default function LoginPage() {
  const router = useRouter();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  const onSubmit = async (data: { email: string; password: string }) => {
    try {
      const { error } = await signIn(data.email.trim(), data.password);

      if (error) {
        toast.error(error.message || "Login failed. Please try again.");
      } else {
        router.push("/");
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover p-4 bg-center"
      style={{ backgroundImage: "url('/path/to/your/background.jpg')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">Log In</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.email && (
            <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>
          )}
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`w-full p-3 mb-4 border ${errors.email ? "border-red-600" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />

          {errors.password && (
            <p className="text-red-600 text-sm mb-2">
              {errors.password.message}
            </p>
          )}
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            className={`w-full p-3 mb-6 border ${errors.password ? "border-red-600" : "border-gray-300"} rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } transition duration-200`}
          >
            {isSubmitting ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          <a href="/signup" className="text-blue-600 underline">
            Create a new account
          </a>
        </p>
      </div>
    </div>
  );
}
