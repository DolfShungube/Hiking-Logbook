import React from "react";
import { Link } from "react-router-dom";
import image from '/src/assets/SignUp1.jpg'

const SignUp = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center relative text-black"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Logo at top-left */}
      <div className="absolute top-6 left-8">
        <h1 className="font-bold text-4xl drop-shadow-md">Trailo</h1>
      </div>

      {/* Centered form */}
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full bg-opacity-90">
          <h2 className="text-3xl font-semibold text-center mb-15">Create an account</h2>

          <form>
             <input
              type="name"
              placeholder="First Name"
              className="w-full mb-5 p-3 border border-gray-600 rounded-lg"
            />
             <input
              type="name"
              placeholder="Last Name"
              className="w-full mb-5 p-3 border border-gray-600 rounded-lg"
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-5 p-3 border border-gray-600 rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-5 p-3 border border-gray-600 rounded-lg"
            />
             <input
              type="password"
              placeholder="Confirm password"
              className="w-full mb-5 p-3 border border-gray-600 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 mt-5"
            >
              Sign Up
            </button>

          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;