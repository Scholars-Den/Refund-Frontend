import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { sendOtp, verifyOtp } from "../../../redux/adminOtpSlice";
import { useNavigate } from "react-router-dom";
// import { submitAdminDetails } from "../../../redux/adminDetailsSlice";

const AdminSignup = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(true);
  // const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [submitMessage, setSubmitMessage] = useState("");
  const [showReloading, setShowReloading] = useState(false);

//   const dispatch = useDispatch();
  const navigate = useNavigate();
  const { adminDetails } = useSelector((state) => state.adminDetails);
//   const handleSendOtp = async () => {
//     if (contactNumber.length !== 10 || !/^\d+$/.test(contactNumber)) {
//       setError("Please enter a valid 10-digit contact number.");
//       return;
//     }

//     setShowReloading(true);

//     try {
//       setError("");
//       const result = await dispatch(sendOtp({ contactNumber }));
//       console.log("result", result);
//       if (sendOtp.fulfilled.match(result)) {
//         setOtpSent(true);
//         setSubmitMessage("OTP sent successfully.");
//       } else {
//         setError(result.payload?.message || "Failed to send OTP.");
//       }
//     } catch (err) {
//       setError("Something went wrong.");
//     } finally {
//       setShowReloading(false);
//     }
//   };

//   const handleVerifyOtp = async () => {
//     // if (otp.length !== 4 || !/^\d+$/.test(otp)) {
//     //   setError("Enter a valid 4-digit OTP.");
//     //   return;
//     // }

//     try {
//     //   setError("");
//     //   const result = await dispatch(verifyOtp({ contactNumber, otp }));
//     //   console.log(
//     //     "verifyOTP.fullfilled.match(result)",
//     //     verifyOtp.fulfilled.match(result)
//     //   );
//     //   console.log("result", result);
//     //   if (verifyOtp.fulfilled.match(result)) {
//         setSubmitMessage("OTP verified successfully.");
//         const isLogin = await dispatch(submitAdminDetails(contactNumber));
//         console.log(
//           "verify.fullfilled",
//           submitAdminDetails.fulfilled.match(isLogin)
//         );
//         console.log("isLogin", isLogin);

//         console.log("adminDetails", adminDetails);
//         const role = isLogin.payload.adminDetails.role;
//         console.log("role from handleVerifyOTP", role);
//         if (role === "admin") {
//           navigate("/adminDashboard");
//         } else if (role === "cashier") {
//           navigate("/cashierDashboard");
//         } else if (role === "counsellor") {
//           navigate("/consellorDashboard");
//         } else if (role === "admissionHead") {
//           navigate("/admissionHeadDasboard");
//         } else if (role === "accounts") {
//           navigate("/accountsDashboard");
//         }
//       // } else {
//       //   setError(result.payload?.message || "Invalid OTP.");
//       // }
//     } catch (error) {
//       console.log("error", error);
//       setError("Verification failed.");
//     }
//   };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-red-700 text-white px-4">
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

        <div className="mb-4">
          <label htmlFor="contactNumber" className="block mb-1">
            Contact Number
          </label>
          <input
            type="text"
            id="contactNumber"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="w-full px-4 py-2 rounded bg-red-700 border border-white text-white"
            maxLength={10}
            placeholder="Enter 10-digit number"
          />
        </div>
        {showReloading && (
          <div className="flex justify-center items-center m-3">
            <div className="animate-spin  rounded-full h-5 w-5 border-b-2 border-white"></div>
          </div>
        )}

        {/* {otpSent && (
          <div className="mb-4">
            <label htmlFor="otp" className="block mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 rounded bg-red-700 border border-white text-white"
              maxLength={4}
              placeholder="Enter OTP"
            />
          </div>
        )} */}

        {error && <p className="text-yellow-300 text-sm mb-4">{error}</p>}
        {submitMessage && (
          <p className="text-green-300 text-sm mb-4">{submitMessage}</p>
        )}

        <div className="flex flex-col gap-4">
          {/* {!otpSent ? (
            <button
              type="button"
              onClick={handleSendOtp}
              className="bg-yellow-500 text-black py-2 rounded hover:bg-yellow-600"
            >
              Send OTP
            </button>
          ) : ( */}
            <button
              type="button"
            //   onClick={handleVerifyOtp}
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Verify OTP
            </button>
          {/* )} */}
        </div>
      </div>
    </div>
  );
};

export default AdminSignup;
