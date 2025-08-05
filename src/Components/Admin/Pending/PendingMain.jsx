import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllStudentDetails } from "../../../../redux/slices/allStudentDetails";
import StudentModal from "./StudentModal";
import { getStudentLog } from "../../../../redux/slices/studentLog";

const PendingMain = () => {
  const [studentsStatus, setStudentsStatus] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { studentLog, loading, error, totalPages } = useSelector(
    (state) => state.studentLog
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getStudentLog());
  }, []);

  useEffect(() => {
    setStudentsStatus(studentLog);
    console.log("studentLogsxAxjbcjkbk................", studentLog);
    console.log("totalPages............................", totalPages);
  }, [studentLog]);
  useEffect(() => {
    console.log("studentsStatus", studentsStatus);
  }, [studentsStatus]);

  // Status badge style helper
  const getStatusBadge = (status) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      case "Disburse":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10); // You can make this adjustable

  useEffect(() => {
    dispatch(getStudentLog({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  useEffect(() => {
    setStudentsStatus(studentLog);
  }, [studentLog]);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Pending Students
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <p className="text-red-600 text-center font-medium">{error}</p>
      ) : studentsStatus.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No pending students found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white sadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Roll No</th>
                <th className="py-3 px-4 text-left">Batch</th>
                {/* <th className="py-3 px-4 text-left">Status</th> */}
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentsStatus.length > 0 &&
                studentsStatus.map((student, index) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="py-3 px-4">{index + 1}</td>
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {student.student.name}
                    </td>
                    <td className="py-3 px-4">{student.student.rollNumber}</td>
                    <td className="py-3 px-4">{student.student.batch}</td>
                    {/* <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>
                  </td> */}
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        Change Status
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
       
        </div>
      )}

      {/* Modal */}
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={() => setSelectedStudent(null)}
        />
      )}
    </div>
  );
};

export default PendingMain;
