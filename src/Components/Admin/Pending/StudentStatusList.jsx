import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentLog } from "../../../../redux/slices/studentLog";
import StudentModal from "./StudentModal";

const StudentStatusList = ({ statusFilter, title, statusList }) => {
  const [studentsStatus, setStudentsStatus] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const { studentLog, loading, error, totalPages } = useSelector(
    (state) => state.studentLog
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const dispatch = useDispatch();
  useEffect(() => {
    // Only fetch once on mount
    if (!studentLog?.length) {
      dispatch(getStudentLog(statusFilter));
    }
  }, []);

  useEffect(() => {
    dispatch(getStudentLog({ status: statusFilter, page: currentPage }));
  }, [currentPage]);

  useEffect(() => {
    console.log("studentLog", studentLog);
    console.log("studentLog", totalPages);
  }, [studentLog]);
  useEffect(() => {
    if (Array.isArray(studentLog)) {
      // const filtered = statusFilter
      //   ? studentLog.data.filter((log) => log.status === statusFilter)
      //   : studentLog.data;

      //   setStudentsStatus(filtered);

      setStudentsStatus(studentLog);
    } else {
      setStudentsStatus([]); // fallback if it's not an array
    }
  }, [studentLog, statusFilter]);

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

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-8">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
        {title || "Students"}
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      ) : error ? (
        <p className="text-red-600 text-center font-medium">{error}</p>
      ) : studentsStatus.length === 0 ? (
        <p className="text-center text-gray-500 italic">
          No {statusFilter?.toLowerCase() || "students"} found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-100 text-gray-700 text-sm font-semibold">
              <tr>
                <th className="py-3 px-4 text-left">#</th>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Roll No</th>
                <th className="py-3 px-4 text-left">Batch</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {studentsStatus.map((student, index) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="py-3 px-4">{(currentPage-1) * 10 + index + 1}</td>
                  <td className="py-3 px-4 font-medium text-gray-800">
                    {student.student.name}
                  </td>
                  <td className="py-3 px-4">{student.student.rollNumber}</td>
                  <td className="py-3 px-4">{student.student.batch}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusBadge(
                        student.status
                      )}`}
                    >
                      {student.status}
                    </span>
                  </td>
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
          {/* {totalPages > 1 && (
            <div className="flex justify-center mt-6 space-x-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === idx + 1 ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              ))}

              <button
                disabled={currentPage === totalPages}
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )} */}




          {totalPages > 1 && (
  <div className="flex justify-center mt-8">
    <nav className="inline-flex items-center space-x-1 rounded-md shadow-sm" aria-label="Pagination">
      <button
        disabled={currentPage === 1}
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        className={`px-3 py-2 text-sm font-medium border rounded-l-md ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((page) => {
          if (totalPages <= 7) return true;
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          )
            return true;
          return false;
        })
        .map((page, idx, arr) => {
          const prevPage = arr[idx - 1];
          const showDots = prevPage && page - prevPage > 1;

          return showDots ? (
            <span key={`dots-${page}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-2 text-sm font-medium border ${
                currentPage === page
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        className={`px-3 py-2 text-sm font-medium border rounded-r-md ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white text-gray-700 hover:bg-gray-50"
        }`}
      >
        Next
      </button>
    </nav>
  </div>
)}

        </div>
      )}

      {/* Modal */}
      {selectedStudent && (
        <StudentModal
          student={selectedStudent}
          onClose={(dataupdate) => {
            setSelectedStudent(null);
            if (dataupdate) {
              dispatch(getStudentLog(statusFilter));
            }
          }}
          statusFilter={statusFilter}
          statusList={statusList}
        />
      )}
    </div>
  );
};

export default StudentStatusList;
