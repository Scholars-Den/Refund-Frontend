import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getStudentLog } from "../../../../redux/slices/studentLog";
import StudentModal from "./StudentModal";
import {
  downloadExcelForRefund,
  formatDate,
} from "../../../../utils/DownloadExcel";

const getDocumentList = (documentValue) => {
  if (!documentValue) return [];
  if (Array.isArray(documentValue)) return documentValue.filter(Boolean);

  const raw = String(documentValue).trim();
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_) {}

  return raw
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const downloadStudentFullFormPdf = (studentLog) => {
  const data = studentLog?.student;
  if (!data) return;

  const docs = getDocumentList(data.document);
  const printableWindow = window.open("", "_blank");
  if (!printableWindow) {
    alert("Please allow popups to download the PDF.");
    return;
  }

  const fieldRows = [
    ["Name", data.name || "-"],
    ["Roll Number", data.rollNumber || "-"],
    ["Father's Name", data.fatherName || "-"],
    ["Mobile Number", data.mobileNumber || "-"],
    ["Batch", data.batch || "-"],
    ["Session", data.session || "-"],
    [
      "Date Of Admission",
      data.dateOfAdmission ? data.dateOfAdmission.split("T")[0] : "-",
    ],
    ["Account Holder", data.accountHolderName || "-"],
    ["Account Number", data.accountNumber || "-"],
    ["Bank Name", data.bankName || "-"],
    ["IFSC", data.ifsc || "-"],
    ["Relation With Student", data.relationWithStudent || "-"],
    ["Caution Money Deposited", data.cautionMoneyDeposited || "-"],
    ["Student Remark", data.remark || "-"],
    ["Current Status", studentLog.status || "-"],
    ["Admin Remarks", studentLog.remarks || "-"],
  ];

  const tableRows = fieldRows
    .map(
      ([label, value]) =>
        `<tr><td class="label">${label}</td><td class="value">${value}</td></tr>`
    )
    .join("");

  const docsMarkup = docs.length
    ? docs
        .map(
          (doc, index) => `
          <div class="doc-card">
            <div class="doc-title">Document ${index + 1}</div>
            <img src="${doc}" alt="Student Document ${index + 1}" />
          </div>
        `
        )
        .join("")
    : `<div class="empty-doc">No document uploaded.</div>`;

  printableWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Student Full Form - ${data.rollNumber || data.name || "student"}</title>
      <style>
        * { box-sizing: border-box; font-family: "Segoe UI", Arial, sans-serif; }
        body { margin: 0; padding: 24px; background: #f8fafc; color: #0f172a; }
        .sheet { max-width: 860px; margin: 0 auto; background: #fff; border-radius: 14px; padding: 24px; border: 1px solid #e2e8f0; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
        .title { margin: 0; font-size: 26px; color: #0f172a; }
        .sub { color: #475569; font-size: 14px; }
        .status { background: #dbeafe; color: #1e40af; border-radius: 999px; padding: 6px 10px; font-size: 12px; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        td { border: 1px solid #e2e8f0; padding: 10px 12px; vertical-align: top; }
        .label { width: 35%; font-weight: 600; color: #334155; background: #f8fafc; }
        .value { color: #0f172a; }
        h3 { margin-top: 24px; margin-bottom: 12px; color: #0f172a; }
        .docs { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 12px; }
        .doc-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; background: #fff; }
        .doc-title { font-size: 13px; color: #334155; margin-bottom: 8px; font-weight: 600; }
        .doc-card img { width: 100%; border-radius: 8px; border: 1px solid #e2e8f0; }
        .empty-doc { color: #64748b; font-style: italic; }
        @media print {
          body { background: #fff; padding: 0; }
          .sheet { border: none; border-radius: 0; max-width: 100%; }
        }
      </style>
    </head>
    <body>
      <div class="sheet">
        <div class="header">
          <div>
            <h1 class="title">Refund Form</h1>
            <div class="sub">Generated on ${new Date().toLocaleString()}</div>
          </div>
          <span class="status">${studentLog.status || "Submitted"}</span>
        </div>
        <table>${tableRows}</table>
        <h3>Uploaded Document(s)</h3>
        <div class="docs">${docsMarkup}</div>
      </div>
      <script>
        window.onload = () => {
          setTimeout(() => {
            window.print();
            window.close();
          }, 500);
        };
      </script>
    </body>
    </html>
  `);
  printableWindow.document.close();
};

const StudentStatusList = ({ statusFilter, title, statusList }) => {
  const [studentsStatus, setStudentsStatus] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
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

  const applyMonthFilter = (monthValue) => {
    setSelectedMonth(monthValue);
    if (!monthValue) {
      setStartDate("");
      setEndDate("");
      return;
    }
    const [year, month] = monthValue.split("-").map(Number);
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const toYmd = (d) => d.toISOString().split("T")[0];
    setStartDate(toYmd(firstDay));
    setEndDate(toYmd(lastDay));
    setApplyFilter(false);
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
              Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => applyMonthFilter(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
                setApplyFilter(false);
                setSelectedMonth("");
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
                setSelectedMonth("");

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
          <button
            onClick={() => {
              setSelectedMonth("");
              setStartDate("");
              setEndDate("");
              setApplyFilter(false);
              setCurrentPage(1);
              dispatch(
                getStudentLog({
                  status: statusFilter,
                  page: 1,
                  startDate: "",
                  endDate: "",
                })
              );
            }}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
          >
            Clear
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
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="p-2 rounded-md border border-blue-200 text-blue-700 hover:bg-blue-50"
                        title="Change status"
                        aria-label="Change status"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7s-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button
                        onClick={() => downloadStudentFullFormPdf(student)}
                        className="p-2 rounded-md border border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                        title="Download full form PDF"
                        aria-label="Download full form PDF"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 3v12m0 0l4-4m-4 4l-4-4m-5 8h18"
                          />
                        </svg>
                      </button>
                    </div>
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
