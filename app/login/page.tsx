"use client";

import React, { useState } from "react";
import InputField from "../../components/Shared/InputField";
import ButtonField from "../../components/Shared/ButtonField";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { AUTHTOKEN_LOCALSTORAGE } from "../constants";

const Login: React.FC = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const router = useRouter();

  const navigateToSheets = () => {
    router.push("sheets");
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validate: (values) => {
      const errors: Record<string , string> = {};

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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem(AUTHTOKEN_LOCALSTORAGE, data.token);
        setMessage("Login successful!");
        setMessageType("success");
        navigateToSheets();
      } else if (response.status === 422) {
        alert(data.message); 
      }
      else {
        setMessage("Login failed.");
        setMessageType("error");      }
    },
  });

  return (
    <div className="flex items-center justify-center h-screen linear-Gredint">
      <div className="p-8 rounded-xl shadow-xl w-[90%] max-w-md">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Login
        </h1>
          {message && (
              <div
                className={`text-center ${
                  messageType === "success" ? "text-green-500" : "text-red-500"
                }`}
              >
                <p>{message}</p>
              </div>
            )}
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4 relative">
            {/* <input
            type="text"
            placeholder="Username"
            className="bg-gray-100 px-4 py-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          /> */}
            <InputField
              type="email"
              placeholder="Email"
              style="px-4 py-3 text-gray-900 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none  shadow-sm"
              name="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>

          <div className="mb-4 relative">
            {/* <input
            type="password"
            placeholder="Password"
            className="bg-gray-100 px-4 py-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          /> */}
            <InputField
              type="password"
              placeholder="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 rounded-lg w-full hover:shadow-lg transform hover:scale-105 transition duration-300"
        >
          Login
        </button> */}
          <ButtonField
            title="Login"
            type="submit"
            style="w-full bg-blue-500 text-white"
            handleButtonClick={()=>{}}
          />

          <div className="my-4 text-center text-gray-400">or</div>

          <div className="flex gap-4 justify-center">
            <button className="bg-gray-100 p-3 rounded-full shadow-sm hover:bg-gray-200">
              <img
                src="https://img.icons8.com/ios-filled/50/null/facebook-new.png"
                alt="Facebook"
                className="h-6 w-6"
              />
            </button>
            <button className="bg-gray-100 p-3 rounded-full shadow-sm hover:bg-gray-200">
              <img
                src="https://img.icons8.com/ios-filled/50/null/google-logo.png"
                alt="Google"
                className="h-6 w-6"
              />
            </button>
            <button className="bg-gray-100 p-3 rounded-full shadow-sm hover:bg-gray-200">
              <img
                src="https://img.icons8.com/ios-filled/50/null/linkedin.png"
                alt="LinkedIn"
                className="h-6 w-6"
              />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;

