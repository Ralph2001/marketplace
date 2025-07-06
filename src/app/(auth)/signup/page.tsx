"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signup } from "../../actions/auth/actions";

const signupSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .nonempty("Password is required"),
});

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
  });

  const router = useRouter();

  const onSubmit = async (data: { email: string; password: string }) => {
    const res = await signup({
      email: data.email,
      password: data.password,
    });

    if (res.success) {
      toast.success("Account created. You are now logged in.");
      router.push("/");
    } else {
      toast.error(res.error ?? "Signup failed. Please try again.");
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover p-4 bg-center"
      style={{ backgroundImage: "url('/path/to/your/background.jpg')" }}
    >
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
        <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.email && (
            <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>
          )}
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            className={`w-full p-3 mb-4 border ${
              errors.email ? "border-red-600" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
            className={`w-full p-3 mb-6 border ${
              errors.password ? "border-red-600" : "border-gray-300"
            } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded text-white ${
              isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            } transition duration-200`}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>

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
