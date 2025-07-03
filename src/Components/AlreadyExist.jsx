import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetails } from "../../redux/slices/studentDetails";
import Header from "./Header";
import Loading from "./Loading";

const AlreadyExist = () => {
  const dispatch = useDispatch();
  const { studentDetails, loading } = useSelector((state) => state.studentDetails);

  useEffect(() => {
    dispatch(fetchStudentDetails());
  }, []);

  if (loading || !studentDetails) {
    return (
      <Loading/>
    );
  }

  const submissionDate = studentDetails?.createdAt
    ? new Date(studentDetails.createdAt).toLocaleDateString()
    : "N/A";
  const rollNumber = studentDetails?.rollNumber || "N/A";
  const name = studentDetails?.name || "N/A";
  const session = studentDetails?.session || "N/A"

  const batch = studentDetails?.batch || "N/A";

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
        <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6">
          Form Already Submitted
        </h2>

        <p className="text-gray-700 text-lg leading-relaxed">
          Your caution money refund form, submitted on{" "}
          <span className="font-semibold text-black">{submissionDate}</span> for
          Roll No.{" "}
          <span className="font-semibold text-black">{rollNumber}</span>, Name:{" "}
          <span className="font-semibold text-black">{name}</span>, Session:{" "}
          <span className="font-semibold text-black">{session}</span>, Batch:{" "}
          <span className="font-semibold text-black">{batch}</span>.
        </p>

        <div className="mt-8">
          <button
            onClick={() => (window.location.href = "/")}
            className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AlreadyExist;
