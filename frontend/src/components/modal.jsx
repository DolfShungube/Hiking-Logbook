import React from 'react'
import { useState } from 'react'

const Modal = ({ heading, message, setShowModal }) => {
  return (
    <section className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <section className="bg-white rounded-2xl shadow-lg w-full max-w-sm p-6 animate-fadeIn">
        
        {/* Heading */}
        <h1 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
          {heading}
        </h1>
        
        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>
        
        {/* Actions */}
        <footer className="flex justify-end">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg shadow-sm transition-all duration-200"
            onClick={() => setShowModal(false)}
          >
            OK
          </button>
        </footer>
      </section>
    </section>
  );
};


export default Modal