import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  createInitialStudent,
  updateStudentDetails,
} from "../../redux/slices/studentDetails";
import axios from "../../api/axios";
import { updateAdminDetails } from "../../redux/slices/adminDetails";

const AdminSignup = () => {
  const { studentDetails } = useSelector((state) => state.studentDetails);
  const [code, setCode] = useState("");
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [codeEntered, setCodeEntered] = useState(false);
  const [showReloading, setShowReloading] = useState(false);
  const [submittingOtp, setSubmittingOtp] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    mobileNumber: "",
  });

  const validateForm = () => {
    if (
      !studentDetails.mobileNumber ||
      studentDetails.mobileNumber.length !== 10
    ) {
      setSubmitMessage("Please enter a valid 10-digit phone number.");
      return false;
    }
    return true;
  };

  const checkVerificationCode = async () => {
    try {
      const response = await axios.post("/auth/verifyNumber", {
        mobileNumber: studentDetails.mobileNumber,
        otp: code,
      });

      if (response.data.success) {
        setCodeVerified(true);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("OTP Verification failed", error);
      return false;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmittingOtp(true);

    const verified = await checkVerificationCode();

    if (!verified) {
      setCodeVerified(false);
      setShowCodeBox(false);
      setSubmitMessage("Invalid OTP. Please try again.");
      setSubmittingOtp(false);
      return;
    }

    if (!validateForm()) {
      setSubmittingOtp(false);
      return;
    }

    try {
      const resultAction = await dispatch(
        createInitialStudent(studentDetails.mobileNumber)
      );

      if (createInitialStudent.fulfilled.match(resultAction)) {
        const { message } = resultAction.payload.studentDetails;

        if (message === "Student already exists") {
          navigate("/alreadyExist");
        } else {
          navigate("/form");
        }
      } else {
        console.error("Form submission failed", resultAction.payload);
        setSubmitMessage("Something went wrong. Try again.");
      }
    } catch (error) {
      console.log("Error submitting form:", error);
      setSubmitMessage("Something went wrong. Try again.");
    } finally {
      setSubmittingOtp(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobileNumber" && value.length > 10) return;

    dispatch(updateAdminDetails({ [name]: value }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? "" : `${name} is required`,
    }));
  };

  const verifyPhoneNo = async () => {
    if (studentDetails?.mobileNumber?.length !== 10) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        mobileNumber: `The number must be exactly 10 digits.`,
      }));
      return;
    }

    try {
      setShowReloading(true);
      const response = await axios.post("/auth/sendVerification", {
        mobileNumber: studentDetails.mobileNumber,
      });

      if (response.status === 200) {
        setShowCodeBox(true);
        setSubmitMessage("OTP sent successfully");
      }
    } catch (error) {
      console.error("Error sending OTP", error);
      setSubmitMessage(error.response?.data?.message || "Error sending OTP");
    } finally {
      setShowReloading(false);
    }
  };

  const handleOTPChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4) {
      setCode(value);
      setCodeEntered(value.length === 4);
    }
  };

  return (
    <div className="w-full min-h-screen bg-green-100 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-xl p-6 sm:p-8 rounded-xl w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-green-700 mb-6">
          Phone Number Verification
        </h2>

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number (Parent) <span className="text-red-600">*</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="number"
                name="mobileNumber"
                value={studentDetails?.mobileNumber || ""}
                onChange={handleChange}
                placeholder="Enter Contact Number"
                className="flex-grow p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {!showCodeBox && !codeVerified && (
                <button
                  type="button"
                  onClick={verifyPhoneNo}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-md font-semibold whitespace-nowrap"
                >
                  Send OTP
                </button>
              )}
            </div>
            {errors.mobileNumber && (
              <p className="text-red-600 text-sm mt-1">{errors.mobileNumber}</p>
            )}
          </div>

          {/* OTP Input */}
          {showCodeBox && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Code (OTP)
              </label>
              <input
                type="text"
                name="otp"
                value={code}
                onChange={handleOTPChange}
                maxLength={4}
                placeholder="Enter OTP"
                className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
              />
            </div>
          )}

          {/* Loading Spinner */}
          {showReloading && (
            <div className="flex justify-center">
              <div className="animate-spin h-5 w-5 border-2 border-t-transparent border-green-600 rounded-full" />
            </div>
          )}

          {/* Message */}
          {submitMessage && (
            <p className="text-sm text-green-600 text-center">
              {submitMessage}
            </p>
          )}

          {/* Submit Button */}
          {showCodeBox && (
            <button
              type="submit"
              disabled={!codeEntered || submittingOtp}
              className={`w-full py-3 rounded-md font-semibold transition duration-200 flex items-center justify-center ${
                !codeEntered || submittingOtp
                  ? "bg-gray-300 cursor-not-allowed text-gray-500"
                  : "bg-green-600 hover:bg-green-700 text-white"
              }`}
            >
              {submittingOtp ? (
                <div className="flex items-center gap-2">
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </div>
              ) : (
                "Next"
              )}
            </button>
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminSignup;
