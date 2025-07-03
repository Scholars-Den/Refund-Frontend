import React from "react";

const Declaration = ({ checked, onChange }) => {
  return (
    <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-md p-4">
      <label className="flex items-start space-x-2 text-sm text-gray-800">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="mt-1 h-4 w-4 text-yellow-600 border-gray-300 rounded focus:ring-yellow-500"
          required
        />
        <span>
          I hereby declare that all the information provided above is true and correct to the best of my knowledge. I understand that any incorrect details — especially bank account information — are solely my responsibility. ScholarsDen shall not be held liable for any payment failures, delays, or losses due to incorrect or incomplete information submitted by me.
        </span>
      </label>
    </div>
  );
};

export default Declaration;
