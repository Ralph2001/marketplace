"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { login } from "../../actions/auth/actions";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const router = useRouter();
  const onSubmit = async (data: { email: string; password: string }) => {
    const res = await login({
      email: data.email,
      password: data.password,
    });

    if (res.success) {
      toast.success("Logged In");
      router.push("/");
    } else {
      toast.error(res.error ?? "Login failed");
    }
  };

  return (
    <div className="bg-white min-h-screen  h-full flex w-full">
      <div className="flex w-full flex-col-reverse md:flex-row gap-2 md:gap-4 mx-auto max-w-screen-xl p-4 md:p-10">
        <div className="h-full  justify-center flex flex-col p-4 md:p-10 md:w-[30rem] rounded-2xl">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2 text-center">Welcome back!</h2>
          <p className="text-sm text-gray-700 text-center">Today is a new day. It's your day. You shape it.</p>
          <p className="text-sm text-gray-700 mb-6 text-center">Sign in to browse products</p>
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

            <div className="flex flex-col mb-4 ">
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
              <Link href={''} className="text-blue-500 text-sm mt-2 ml-auto font-medium hover:underline">Forgot Password?</Link>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2.5 rounded-lg cursor-pointer text-white ${isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-[#162D3A] hover:bg-[#162D3A]/90"
                } transition duration-200 disabled:cursor-pointer`}
            >
              {isSubmitting ? "Sining in..." : "Sign in"}
            </button>
          </form>

          <hr className="border-t border-gray-300 my-5" />

          <div className="flex flex-col  gap-2">
            <Link href={''} className="rounded-lg w-full bg-slate-100 hover:bg-gray-200 transition-all duration-300 h-10 flex items-center justify-center font-normal text-md flex-row gap-2"><div className="w-[50%] flex justify-end">
              <FcGoogle size={20} /></div><span className=" text-sm  w-full">Sign in with Google</span></Link>
            <Link href={''} className="rounded-lg w-full bg-slate-100 hover:bg-gray-200 transition-all duration-300 h-10 flex items-center justify-center font-normal text-md flex-row gap-2"><div className="w-[50%] flex justify-end">
              <FaFacebook className="text-blue-500" size={20} /></div><span className=" text-sm  w-full">Sign in with Facebook</span></Link>
          </div>
          <p className="text-center my-6 text-gray-600 text-sm">Don't have an account? <Link className="text-blue-600 font-medium" href={'/signup'} >Sign up </Link></p>

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
