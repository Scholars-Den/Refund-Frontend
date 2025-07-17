import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createInitialStudent,
  updateStudentDetails,
} from "../../redux/slices/studentDetails";
import axios from "../../api/axios";
import Header from "./Header";

const Login = () => {
  const { studentDetails } = useSelector((state) => state.studentDetails);
  const [code, setCode] = useState("");
  const [showCodeBox, setShowCodeBox] = useState(false);
  const [codeVerified, setCodeVerified] = useState(true);
  // const [codeVerified, setCodeVerified] = useState(false);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNumber" && value.length > 10) return;

    dispatch(updateStudentDetails({ [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: value ? "" : `${name} is required`,
    }));
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
  const handleOTPChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4) {
      setCode(value);
      setCodeEntered(value.length === 4);
    }
  };

  const verifyPhoneNo = async () => {
    if (studentDetails?.mobileNumber?.length !== 10) {
      setErrors((prev) => ({
        ...prev,
        mobileNumber: "The number must be exactly 10 digits.",
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
        setSubmitMessage("OTP sent successfully.");
      }
    } catch (error) {
      console.error("OTP error", error);
      setSubmitMessage(error.response?.data?.message || "Error sending OTP.");
    } finally {
      setShowReloading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmittingOtp(true);

    // if (!validateForm()) {
    //   setSubmittingOtp(false);
    //   return;
    // }

    // Simulate verified OTP for now
    const verified = true;
    // const verified = await checkVerificationCode();

    if (!verified) {
      setCodeVerified(false);
      setShowCodeBox(false);
      setSubmitMessage("Invalid OTP. Please try again.");
      setSubmittingOtp(false);
      return;
    }

    try {
      const resultAction = await dispatch(
        createInitialStudent(studentDetails.mobileNumber)
      );

      if (createInitialStudent.fulfilled.match(resultAction)) {
        const { message } = resultAction.payload.studentDetails;
        message === "Student already exists"
          ? navigate("/alreadyExist")
          : navigate("/form");
      } else {
        setSubmitMessage("Something went wrong. Try again.");
      }
    } catch (error) {
      console.error("Submission error", error);
      setSubmitMessage("Something went wrong. Try again.");
    } finally {
      setSubmittingOtp(false);
    }
  };

  useEffect(() => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }, []);

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

        <div className=" flex-grow sm:items-center sm:justify-center w-full rounded-2xl p-6 sm:p-8 sm:mt-10">
          <h2 className="text-3xl font-extrabold text-green-700 text-center mb-8">
            Phone Number Verification
          </h2>

          <form onSubmit={onSubmit} className="space-y-6">
            {/* Contact Number */}
            <div>
              <label
                htmlFor="mobileNumber"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contact Number (Parent) <span className="text-red-600">*</span>
              </label>
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <input
                  id="mobileNumber"
                  type="tel"
                  name="mobileNumber"
                  value={studentDetails?.mobileNumber || ""}
                  onChange={handleChange}
                  placeholder="Enter Contact Number"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
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
                <p className="text-sm text-red-600 mt-1">
                  {errors.mobileNumber}
                </p>
              )}
            </div>

            {/* OTP Field */}
            {showCodeBox && (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Verification Code (OTP)
                </label>
                <input
                  id="otp"
                  type="text"
                  name="otp"
                  value={code}
                  onChange={handleOTPChange}
                  maxLength={4}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
            )}

            {/* Loading Spinner */}
            {showReloading && (
              <div className="flex justify-center">
                <div className="h-5 w-5 border-2 border-t-transparent border-green-500 rounded-full animate-spin" />
              </div>
            )}

            {/* Message Feedback */}
            {submitMessage && (
              <p className="text-sm text-center text-green-600">
                {submitMessage}
              </p>
            )}

            {/* Submit Button */}
            {/* {showCodeBox && ( */}
              <button
                type="submit"
                // disabled={!codeEntered || submittingOtp}
                className={`w-full py-3 rounded-md font-semibold transition duration-200 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white`}
                // disabled={!codeEntered || submittingOtp}
                // className={`w-full py-3 rounded-md font-semibold transition duration-200 flex items-center justify-center ${
                //   !codeEntered || submittingOtp
                //     ? "bg-gray-300 cursor-not-allowed text-gray-500"
                //     : "bg-green-600 hover:bg-green-700 text-white"
                // }`}
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
             {/* )}  */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
