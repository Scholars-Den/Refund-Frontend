import React from "react";
import logo from "../assets/scholarsdenLogo.png"; // Adjust path as needed

const Header = () => {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm rounded-xl px-4 md:px-10 pt-2 pb-3">
      <div className="flex flex-col gap-3">
        <div className="flex flex-row justify-between items-start sm:items-center gap-2">
          {/* Logo */}
          <div className="flex items-center">
            <img src={logo} alt="ScholarsDen Logo" className="h-14 sm:h-22 w-auto" />
          </div>

          {/* Contact Info */}
          <div className="text-xs sm:text-sm text-gray-700 text-right leading-5">
            <div className="font-medium text-gray-800">Accounts Department</div>
            <div>
              Email:{" "}
              <a
                href="mailto:accounts@scholarsden.in"
                className="text-blue-600 hover:underline"
              >
                accounts@scholarsden.in
              </a>
            </div>
            <div>
              Support:{" "}
              <a
                href="mailto:support@scholarsden.in"
                className="text-blue-600 hover:underline"
              >
                support@scholarsden.in
              </a>
            </div>
          </div>
        </div>
       

        <p className="mt-1 text-[11px] sm:text-xs sm:text-right sm:text-top text-gray-600">
          If you have any questions, feel free to contact us using the details
          above.
        </p>
   
      </div>
    </header>
  );
};

export default Header;
