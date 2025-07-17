import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentDetails,
  fetchStudentLogDetails,
} from "../../redux/slices/studentDetails";
import Header from "./Header";
import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

const AlreadyExist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentDetails, loading } = useSelector(
    (state) => state.studentDetails
  );

  useEffect(() => {
    dispatch(fetchStudentLogDetails());
  }, [dispatch]);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-700 border border-blue-300";
      case "Approved":
        return "bg-green-100 text-green-700 border border-green-300";
      case "Rejected":
        return "bg-red-100 text-red-700 border border-red-300";
      case "Disburse":
        return "bg-purple-100 text-purple-700 border border-purple-300";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-300";
    }
  };

  if (loading || !studentDetails) {
    return <Loading />;
  }

  const editHandler = () => {
    navigate("/form");
  };

  const submissionDate = studentDetails?.student?.createdAt
    ? new Date(studentDetails.student.createdAt).toLocaleDateString()
    : "N/A";

  const {
    rollNumber = "N/A",
    name = "N/A",
    session = "N/A",
    batch = "N/A",
  } = studentDetails?.student || {};

  return (
    <div className="flex items-center justify-center bg-green-50 min-h-screen px-4 sm:px-6">
      <div className="w-full min-h-screen max-w-3xl bg-white shadow-md rounded-xl p-6 sm:p-8">
        <Header />

        <div className="text-center mt-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-red-600 uppercase tracking-wider">
            Caution Money Refund Application
          </h1>
        </div>

        <div className="flex justify-end mt-4">
          {studentDetails?.status && (
            <span
              className={`text-sm font-medium px-4 py-1 rounded-full ${getStatusBadgeClass(
                studentDetails.status
              )}`}
            >
              {studentDetails.status}
            </span>
          )}
        </div>

        {studentDetails?.remarks && (
          <div className="mt-2 text-right">
            <span
              className={`text-sm font-medium px-4 py-1 rounded-full ${getStatusBadgeClass(
                studentDetails.status
              )}`}
            >
              {studentDetails.remarks}
            </span>
          </div>
        )}

        <div className="text-center mt-10">
          <h2 className="text-2xl sm:text-3xl font-semibold text-green-700 mb-4">
            Form Already Submitted
          </h2>

          <p className="text-gray-700 text-md sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Your caution money refund form was submitted on{" "}
            <span className="font-semibold text-black">{submissionDate}</span>{" "}
            for Roll No.{" "}
            <span className="font-semibold text-black">{rollNumber}</span>, Name:{" "}
            <span className="font-semibold text-black">{name}</span>, Session:{" "}
            <span className="font-semibold text-black">{session}</span>, Batch:{" "}
            <span className="font-semibold text-black">{batch}</span>.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => (window.location.href = "/")}
              className="w-full sm:w-auto px-6 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-all"
            >
              Back to Home
            </button>

            {studentDetails?.status === "Rejected" && (
              <button
                onClick={editHandler}
                className="w-full sm:w-auto px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
              >
                Edit Form
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlreadyExist;
