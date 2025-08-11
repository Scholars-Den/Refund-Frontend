import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentLog } from "../../../../redux/slices/studentLog";
import StudentModal from "./StudentModal";
import {
  downloadExcelForRefund,
  formatDate,
} from "../../../../utils/DownloadExcel";

const StudentStatusList = ({ statusFilter, title, statusList }) => {
  const [studentsStatus, setStudentsStatus] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [applyFilter, setApplyFilter] = useState(false);

  const { studentLog, loading, error, totalPages, totalCount } = useSelector(
    (state) => state.studentLog
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      getStudentLog({
        status: statusFilter,
        page: currentPage,
        startDate,
        endDate,
      })
    );
  }, [currentPage]);

  useEffect(() => {
    if (Array.isArray(studentLog)) {
      setStudentsStatus(studentLog);
    } else {
      setStudentsStatus([]);
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

      {/* Filters and Download */}
      <div className="flex flex-wrap items-center justify-between mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setApplyFilter(false);
                setStartDate(e.target.value);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => {
                setApplyFilter(false);

                setEndDate(e.target.value);
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>

          <button
            onClick={() => {
              setCurrentPage(1);
              dispatch(
                getStudentLog({
                  status: statusFilter,
                  page: 1,
                  startDate,
                  endDate,
                })
              );
              setApplyFilter(true);
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Apply Filter
          </button>
        </div>

        <button
          className="m-2 bg-sky-300 p-4 rounded-2xl hover:bg-sky-500 cursor-pointer"
          onClick={() =>
            downloadExcelForRefund(statusFilter, startDate, endDate)
          }
        >
          Download All Refund
        </button>
      </div>
      {totalCount && (
        <div className=" w-full flex justify-end">
          <span>Total Count : {totalCount}</span>
        </div>
      )}

      {/* Loading / Error / No Data */}
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
          {/* ✅ Show applied filters */}
          {applyFilter && (startDate || endDate) && (
            <div className=" text-sm mb-2 mt-4 p-2 text-green-600 ">
              Showing results
              {startDate && (
                <>
                  {" "}
                  from{" "}
                  <span className="font-medium">{formatDate(startDate)}</span>
                </>
              )}
              {endDate && (
                <>
                  {" "}
                  to <span className="font-medium">{formatDate(endDate)}</span>
                </>
              )}
            </div>
          )}

          {/* Table */}

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
                  <td className="py-3 px-4">
                    {(currentPage - 1) * 10 + index + 1}
                  </td>
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

          {/* Pagination */}
          <div className="relative">
            {totalPages > 1 && (
              <div className="relative flex justify-center mt-8">
                <nav
                  className="inline-flex items-center space-x-1 rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    disabled={currentPage === 1}
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    className={`px-3 py-2 text-sm font-medium h-full w-full border rounded-l-md ${
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
                        <span
                          key={`dots-${page}`}
                          className="px-3 py-2 text-gray-500 h-full w-full"
                        >
                          ...
                        </span>
                      ) : (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`w-full h-full px-4 py-2 text-sm font-medium border cursor-pointer text-center ${
                            currentPage === page
                              ? "bg-blue-500 text-white border-blue-500"
                              : "bg-white text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    className={`px-3 py-2 text-sm font-medium border rounded-r-md ${
                      currentPage === totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    Next
                  </button>
                </nav>

                {/* {totalCount && (
                  <div className="absolute top-4 right-5 w-full flex justify-end">
                    <span>Total Count : {totalCount}</span>
                  </div>
                )} */}
              </div>
            )}
          </div>
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
