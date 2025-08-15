import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import image from '/src/assets/SignUp1.jpg'
import { UserAuth } from "../context/AuthContext";
import Modal from "../components/modal";

const SignUp = () => {
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [firstName,setFirstName]=useState("")
const [lastName,setLastName]=useState("")
const [error,setError]=useState("")
const [heading,setHeading]=useState("")
const [loading,setLoading]=useState("")
const [showModal,setShowModal]= useState(false)

const {session,signUpNewUser,signInUser}= UserAuth()
const navigate=useNavigate()

const handleSignUp= async (e)=>{

    e.preventDefault()
    setLoading(true)
    try{
      const result= await signUpNewUser(firstName,lastName,email,password)

      if(result){
        console.log(result)

        if(result.error){
        setShowModal(true)
        setHeading("ERROR !")
        setError(result.error) // function to show successs          
        }else{
        setShowModal(true)
        setHeading("SUCCESS !")
        setError("your account has been created") 

        navigate('/login')
        }// function to show successs
        
       //  //.................
      }
    }catch(error){

      setError(error.message)
      setHeading("ERROR !")
      setShowModal(true)


    }finally{
      setLoading(false)
    }

}




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
           { showModal && <Modal heading={heading} message={error} setShowModal={setShowModal}/>}  
          <form onSubmit={handleSignUp}>
             <input
             onChange={(e)=>setFirstName(e.target.value)}
              type="name"
              placeholder="First Name"
              className="w-full mb-5 p-3 border border-gray-600 rounded-lg"
            />
             <input
             onChange={(e)=>setLastName(e.target.value)}
              type="name"
              placeholder="Last Name"
              className="w-full mb-5 p-3 border border-gray-600 rounded-lg"
            />
            <input
            onChange={(e)=>setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="w-full mb-5 p-3 border border-gray-600 rounded-lg"
            />
            <input
            onChange={(e)=>setPassword(e.target.value)}
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