import React from 'react';
import { Link } from 'react-router-dom';

const SubmittedPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 px-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">Thank you!</h1>
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
  );
};

export default SubmittedPage;
