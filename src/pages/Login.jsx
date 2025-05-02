import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { auth, signInWithEmailAndPassword } from "../firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password,
      );
      const user = userCredential.user;

      if (user.email === data.email) {
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/dashboard");
      } else {
        setErr("Invalid email or password");
      }
    } catch (error) {
      setErr("Invalid email or password");
      console.log(error);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-[#1f1f1f] px-4">
      {/* Top-left Logo */}
      <div className="absolute top-6 left-6">
        <div className="flex items-baseline justify-center gap-x-3">
          <span className="text-4xl font-black text-pink-500">X</span>
          <h1 className="font-mono text-2xl font-bold text-white">Mall</h1>
        </div>
      </div>
      {/* Login Card */}
      <div className="w-full max-w-sm rounded-2xl border border-gray-700 bg-gradient-to-tr from-[#2b2b2b] to-[#1e1e1e] p-8 shadow-md backdrop-blur-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Email Input */}
          <input
            type="email"
            placeholder="Email"
            value={"admin@supermall.com"}
            {...register("email", { required: true })}
            className="w-full rounded-full bg-[#3a3a3a] px-4 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          />
          {errors?.email && (
            <p className="mt-1 text-xs text-red-500">Email is required</p>
          )}

          {/* Password Input */}
          <input
            type="password"
            placeholder="Password"
            value={"Admin@123"}
            {...register("password", { required: true })}
            className="w-full rounded-full bg-[#3a3a3a] px-4 py-2 text-gray-200 placeholder-gray-400 focus:ring-2 focus:ring-pink-400 focus:outline-none"
          />
          {errors?.password && (
            <p className="mt-1 text-xs text-red-500">Password is required</p>
          )}

          {/* Error Message */}
          {err && <p className="text-center text-red-500">{err}</p>}

          {/* Login Button */}
          <button
            type="submit"
            className="w-full rounded-full bg-pink-500 py-2 font-semibold text-white transition duration-200 hover:bg-pink-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
