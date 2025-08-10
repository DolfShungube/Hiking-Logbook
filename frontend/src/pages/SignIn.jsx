import React from "react";
import SignInImage from '../assets/SignIn3.jpg';
import { Link } from "react-router-dom";

const SignIn = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-between items-start text-black px-10"
      style={{ backgroundImage: "url(${SignInImage})" }}
    >
      {/* Logo on top-left */}
      <div className="pt-5">
        <h1 className="font-bold text-4xl">Trailo</h1>
      </div>

      {/* Form on right-center */}
      <div className="absolute top-50 right-50">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full bg-opacity-90">
          <h2 className="text-3xl font-semibold text-center mb-15">LogIn</h2>
          <form>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-3 border border-gray-600 rounded-lg"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-3 border border-gray-600 rounded-lg"
            />
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 mb-6 mt-6"
            >
              SignIn
            </button>
            <p className="mt-6 text-center text-sm">
                Don't have an account?{" "}
                <Link to="/signup" className="text-blue-600 hover:underline">
                    Create one
                </Link>
            </p>

            
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
