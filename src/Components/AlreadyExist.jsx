import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetails } from "../../redux/slices/studentDetails";

const AlreadyExist = () => {
  const dispatch = useDispatch();
  const { studentDetails } = useSelector((state) => state.studentDetails);

  useEffect(() => {
    dispatch(fetchStudentDetails());
  }, [dispatch]);

//   if (loading || !studentDetails) {
//     return (
//       <div className="flex items-center justify-center min-h-screen text-gray-500">
//         Loading student details...
//       </div>
//     );
//   }

  const submissionDate = studentDetails?.createdAt
    ? new Date(studentDetails.createdAt).toLocaleDateString()
    : "N/A";
  const rollNumber = studentDetails?.rollNumber || "N/A";
  const name = studentDetails?.name || "N/A";
  const session = studentDetails?.session
    ? new Date(studentDetails.session).getFullYear()
    : "N/A";
  const batch = studentDetails?.batch || "N/A";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white px-4">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-lg p-8 border border-green-300 text-center">
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
  );
};

export default AlreadyExist;
