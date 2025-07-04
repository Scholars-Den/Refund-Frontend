import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetails } from "../../redux/slices/studentDetails";
import Header from "./Header";
import Loading from "./Loading";
import { Link } from "react-router-dom";

const SubmittedPage = () => {
  const dispatch = useDispatch();
  const { studentDetails, loading } = useSelector(
    (state) => state.studentDetails
  );

  useEffect(() => {
    dispatch(fetchStudentDetails());
  }, [dispatch]);

  if (loading || !studentDetails) {
    return <Loading />;
  }

  const submissionDate = studentDetails?.createdAt
    ? new Date(studentDetails.createdAt).toLocaleDateString()
    : "N/A";

  const rollNumber = studentDetails?.rollNumber || "N/A";
  const name = studentDetails?.name || "N/A";
  const session = studentDetails?.session || "N/A";
  const batch = studentDetails?.batch || "N/A";

  return (
    <div className=" flex items-center justify-center bg-green-100  sm:px-4 ">
      <div className=" flex flex-col justify-center items-center w-full h-screen max-w-3xl bg-white shadow-xl px-3 sm:px-5 py-5   ">
        <div className="w-full">
          <Header />
        </div>

        <div className=" flex-grow text-center items-center justify-center w-full h-full rounded-2xl p-6 sm:p-8 sm:mt-10">
          <div className="flex flex-col items-center  h-full">

          <h2 className="text-2xl font-bold text-green-700 mb-4">Thank you!</h2>
          {/* <p className="text-gray-700 text-lg leading-relaxed">
            Your caution money refund application form was successfully submitted on{" "}
            <span className="font-semibold text-black">{submissionDate}</span> for Roll No.{" "}
            <span className="font-semibold text-black">{rollNumber}</span>, Name:{" "}
            <span className="font-semibold text-black">{name}</span>, Session:{" "}
            <span className="font-semibold text-black">{session}</span>, Batch:{" "}
            <span className="font-semibold text-black">{batch}</span>.
          </p> */}

          <p className="text-gray-600 text-base mt-6">
            Our team will now review your application. You will be contacted if
            any clarification is needed. Please allow a few working days for
            processing.
          </p>
          </div>

          {/* Optional: Uncomment this if you want to allow submitting again */}
          {/* <div className="mt-8">
            <Link
              to="/"
              className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
            >
              Fill Another Form
            </Link>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SubmittedPage;
