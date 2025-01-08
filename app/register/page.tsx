"use client";

import InputField from "../../components/Shared/InputField";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import ButtonField from "@/components/Shared/ButtonField";
import { AUTHTOKEN_LOCALSTORAGE } from "../constants";

const Register: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const router = useRouter();
  const navigateToLogin = () => {
    router.push("login");
  };
  const navigateToSheet = () => {
    router.push("sheets");
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: Record<string, string> = {};

      if (!values.username) {
        errors.username = "Username is required";
      } else if (values.username.length < 3) {
        errors.username = "Username must be at least 10 characters";
      } else if (values.username.length > 15) {
        errors.username = "Username must be at most 15 characters";
      }

      if (!values.email) {
        errors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(values.email)) {
        errors.email = "Email address is invalid";
      }

      if (!values.password) {
        errors.password = "Password is required";
      } else if (values.password.length < 6) {
        errors.password = "Password must be at least 6 characters";
      }

      return errors;
    },
    onSubmit: async (values) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem(AUTHTOKEN_LOCALSTORAGE, data.token);
        setMessage("User registered successfully!");
        setMessageType("success");
        navigateToSheet();
      } else {
        setMessage(data.message);
        setMessageType("error");
      }
    },
  });
  return (
    <>
      {/* <div className="absolute w-[500px] h-[500px] rounded-full bg-dark-green bottom-0 left-0 -translate-x-1/2 translate-y-1/2 -z-10"></div>
      <div className="absolute w-[400px] h-[200px] rounded-[30%] bg-dark-blue top-0 right-0 translate-x-1/2 -z-10"></div> */}
      <div className="flex justify-center items-center h-screen overflow-hidden relative">
        <div className="absolute w-[500px] h-[500px] rounded-full bg-dark-green bottom-0 left-0 -translate-x-1/2 translate-y-1/2 -z-10"></div>
        <div className="absolute w-[400px] h-[200px] rounded-[30%] bg-dark-blue top-0 right-0 translate-x-1/2 -z-10"></div>
        <div className="flex w-[90%] h-[90%] rounded-lg shadow-xl">
          <div className="flex-1 bg-[#39b694bf] text-white flex flex-col items-center justify-center p-5 text-center">
            <h1 className="text-2xl">Welcome Back!</h1>
            <p className="my-5 text-base">
              To keep connected with us please login with your personal info
            </p>
            <ButtonField
              title="SIGN IN"
              handleButtonClick={navigateToLogin}
              style="text-[#6bc8af] bg-white"
            />
          </div>

          <div className="flex flex-1 flex-col items-center justify-center bg-gray-100 p-6">
            <h2 className="text-xl font-bold">Create Account</h2>
            {message && (
              <div
                className={`text-center ${
                  messageType === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                <p>{message}</p>
              </div>
            )}
            <div className="flex gap-4 mt-5">
              <button className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full font-bold">
                f
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full font-bold">
                G+
              </button>
              <button className="w-10 h-10 flex items-center justify-center bg-gray-300 rounded-full font-bold">
                in
              </button>
            </div>
            <p className="mt-4 text-gray-600">
              or use your email for registration:
            </p>
            <form
              onSubmit={formik.handleSubmit}
              className="flex flex-col gap-4 w-4/5 max-w-sm mt-6"
            >
              <InputField
                type="text"
                placeholder="Name"
                name="username"
                onChange={formik.handleChange}
                value={formik.values.username}
                onBlur={formik.handleBlur}
              />
              {formik.touched.username && formik.errors.username && (
                <p className="text-red-500 text-sm">{formik.errors.username}</p>
              )}
              <InputField
                type="email"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
              <InputField
                type="password"
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              )}
              <ButtonField
                title="SIGN UP"
                type="submit"
                style="bg-[#00292d] text-white"
                handleButtonClick={() => {}}
              />
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
export default Register;
