import React, { useState } from "react";
import SignInImage from '../assets/SignIn3.jpg';
import { Link, useNavigate } from "react-router-dom";

import { UserAuth } from "../context/AuthContext";
import Modal from "../components/modal";

const SignIn = () => {

const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [error,setError]=useState("")
const [loading,setLoading]=useState("")
const [showModal,setShowModal]= useState(false)


const {session,signInUser,signOutUser,GooglesignInUser}= UserAuth()
const navigate=useNavigate()
//console.log(session)

// if(session){
//   signOutUser()  // for testing
// }

const handleSignIn= async (e)=>{



    e.preventDefault()
    setLoading(true)
    try{
        console.log("start")
      const result= await signInUser(email,password);
      //console.log(result)

      if(result){
        // console.log("we have res")
        // console.log("result.data.error:", result.data);

        if(result.data && result.data.error){
          
                  setError(result.data.error)
                  setShowModal(true)

                  console.log(result)
        }else{
         console.log("dasg") 
         navigate('/dashboard') //......................................................................
         // remember to add logout authcontext to dashboard
        }



      }
    }catch(error){

      setError("an arror occured")


    }finally{
      setLoading(false)
    }

}


const handleGooglesignInUser= async()=>{

  results= await GooglesignInUser()

  if(results.error){
      setError(results.error)
      setShowModal(true)
  }

}


  return (
    <div
      className="min-h-screen bg-cover bg-center flex justify-between items-start text-black px-10"
      style={{ backgroundImage: `url(${SignInImage})` }}
    >
      {/* Logo on top-left */}
      <div className="pt-5">
        <h1 className="font-bold text-4xl">Trailo</h1>
      </div>

      {/* Form on right-center */}
      <div className="absolute top-25 right-50">
        <div className="bg-white p-10 rounded-2xl shadow-2xl max-w-md w-full bg-opacity-90">
          <h2 className="text-3xl font-semibold text-center mb-15">LogIn</h2>
          { showModal && <Modal heading="ERROR" message={error} setShowModal={setShowModal}/>}
          <form onSubmit={handleSignIn}>
            <input
            onChange={(e)=>setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full mb-4 p-3 border border-gray-600 rounded-lg"
            />
            <input
            onChange={(e)=>setPassword(e.target.value)}
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

            <button
              type="button"
              onClick={handleGooglesignInUser}
              className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 mb-6 mt-6 flex items-center justify-center gap-3">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"alt="Google icon"width={20}height={20}/>
              <span>Sign In with Google</span>
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
