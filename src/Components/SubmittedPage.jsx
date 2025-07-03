import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';

const SubmittedPage = () => {
  return (
       <div className=" flex items-center justify-center bg-green-100  sm:px-4 ">
      <div className=" flex flex-col justify-center items-center w-full h-screen max-w-3xl bg-white shadow-xl px-3 sm:px-5 py-5   ">
        <div className="w-full">
          <Header />
          </div>
          <div className="sm:mt-6 mt-3 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 uppercase tracking-wide">
            Caution Money Refund Application
          </h1>
        </div>

        <div className=" flex-grow text-center items-center justify-center w-full rounded-2xl p-6 sm:p-8 sm:mt-10">
        <h1 className="text-2xl text-center font-bold text-green-700 mb-4">Thank you!</h1>
        <p className="text-gray-600 mb-6">
          Your refund form has been successfully submitted.
        </p>
        <Link
          to="/"
          className="inline-block bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded transition duration-200"
        >
          Fill Another Form
        </Link>
      </div>
    </div>
    </div>
  );
};

export default SubmittedPage;
