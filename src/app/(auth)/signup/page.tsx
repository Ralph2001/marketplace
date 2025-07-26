"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { signup } from "../../actions/auth/actions";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import Image from "next/image";

const signupSchema = z
  .object({
    email: z
      .string()
      .email("Invalid email address")
      .nonempty("Email is required"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Password is required"),
    confirm_password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .nonempty("Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ["confirm_password"],
    message: "Passwords do not match",
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
    // <div
    //   className="h-screen flex items-center justify-center bg-cover p-4 bg-center"
    //   style={{ backgroundImage: "url('/path/to/your/background.jpg')" }}
    // >
    //   <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">
    //     <h1 className="text-3xl font-bold text-center mb-6">Sign Up</h1>

    //     <form onSubmit={handleSubmit(onSubmit)}>
    //       {errors.email && (
    //         <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>
    //       )}
    //       <Input
    //         type="email"
    //         placeholder="Email"
    //         {...register("email")}
    //         className={`w-full p-3 mb-4 border ${
    //           errors.email ? "border-red-600" : "border-gray-300"
    //         } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
    //       />

    //       {errors.password && (
    //         <p className="text-red-600 text-sm mb-2">
    //           {errors.password.message}
    //         </p>
    //       )}
    //       <Input
    //         type="password"
    //         placeholder="Password"
    //         {...register("password")}
    //         className={`w-full p-3 mb-6 border ${
    //           errors.password ? "border-red-600" : "border-gray-300"
    //         } rounded focus:outline-none focus:ring-2 focus:ring-blue-500`}
    //       />

    //       <button
    //         type="submit"
    //         disabled={isSubmitting}
    //         className={`w-full py-3 rounded text-white ${
    //           isSubmitting
    //             ? "bg-gray-400 cursor-not-allowed"
    //             : "bg-green-600 hover:bg-green-700"
    //         } transition duration-200`}
    //       >
    //         {isSubmitting ? "Signing up..." : "Sign Up"}
    //       </button>
    //     </form>

    //     <p className="mt-4 text-sm text-center">
    //       Already have an account?{" "}
    //       <a href="/login" className="text-blue-600 underline">
    //         Log In
    //       </a>
    //     </p>
    //   </div>
    // </div>

    <div className="bg-white min-h-screen  h-full flex w-full">
      <div className="flex w-full flex-col-reverse md:flex-row gap-2 md:gap-4 mx-auto max-w-screen-xl p-4 md:p-10">
        <div className="h-full  justify-center flex flex-col p-4 md:p-10 md:w-[30rem] rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">Create an Account!</h2>
          <p className="text-sm text-gray-700 text-center">Today is a new day. It's your day. You shape it.</p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col">
              <label htmlFor="email" className="text-sm font-medium mb-2">Email</label>
              {/* {errors.email && (
                    <p className="text-red-600 text-sm mb-2">{errors.email.message}</p>
                  )} */}
              <Input
                type="email"
                id="email"
                placeholder="Example@gmail.com"
                {...register("email")}
                className={`w-full p-3 mb-2 border ${errors.email ? "border-red-400" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>

            <div className="flex flex-col mb-2">
              <label htmlFor="password" className="text-sm font-medium mb-2">Password</label>
              {/* {errors.password && (
                    <p className="text-red-600 text-sm mb-2">
                      {errors.password.message}
                    </p>
                  )} */}
              <Input
                type="password"
                id="password"
                placeholder="Password"
                {...register("password")}
                className={`w-full p-3 border ${errors.password ? "border-red-400" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />

            </div>
            <div className="flex flex-col mb-4 ">
              <label htmlFor="confirm_password" className="text-sm font-medium mb-2">Confirm Password</label>
              {/* {errors.password && (
                    <p className="text-red-600 text-sm mb-2">
                      {errors.password.message}
                    </p>
                  )} */}
              <Input
                type="confirm_password"
                id="confirm_password"
                placeholder="Password"
                {...register("confirm_password")}
                className={`w-full p-3 border ${errors.confirm_password ? "border-red-400" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />

            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-lg cursor-pointer text-white ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#162D3A] hover:bg-[#162D3A]/90"
                } transition duration-200 disabled:cursor-pointer`}
            >
              {isSubmitting ? "Sining in..." : "Sign up"}
            </button>
          </form>

          <hr className="border-t border-gray-300 my-5" />

          <div className="flex flex-col  gap-2">
            <Link href={''} className="rounded-lg w-full bg-slate-100 hover:bg-gray-200 transition-all duration-300 h-10 flex items-center justify-center font-normal text-md flex-row gap-2"><div className="w-[50%] flex justify-end">
              <FcGoogle size={20} /></div><span className=" text-sm  w-full">Continue with Google</span></Link>
            <Link href={''} className="rounded-lg w-full bg-slate-100 hover:bg-gray-200 transition-all duration-300 h-10 flex items-center justify-center font-normal text-md flex-row gap-2"><div className="w-[50%] flex justify-end">
              <FaFacebook className="text-blue-500" size={20} /></div><span className=" text-sm  w-full">Continue with Facebook</span></Link>
          </div>
          <p className="text-center my-6 text-gray-600 text-sm">Already have an account? <Link className="text-blue-600 font-medium" href={'/login'} >Sign in </Link></p>

        </div>
        <div className="h-80 sm:h-80 md:h-full  md:flex-1  rounded-2xl relative">
          <Image
            alt="Illustration"
            fill

            className="object-contain"
            src={'/images/illustration.jpg'}
          />
        </div>
      </div>
    </div >
  );
}
