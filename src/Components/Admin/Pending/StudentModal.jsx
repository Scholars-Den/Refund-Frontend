import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { patchStudentLog } from "../../../../redux/slices/studentLog";

const StudentModal = ({ student, onClose, statusList }) => {
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

  const handleDownloadFullFormPdf = () => {
    if (!student?.student) return;
    const data = student.student;
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
      ["Current Status", student.status || "-"],
      ["Admin Remarks", student.remarks || "-"],
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
            <span class="status">${student.status || "Submitted"}</span>
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

  const bgColors = [
    "bg-red-100",
    "bg-green-100",
    "bg-blue-100",
    "bg-yellow-100",
    "bg-purple-100",
    "bg-pink-100",
    "bg-indigo-100",
    "bg-teal-100",
    "bg-orange-100",
  ];

  useEffect(() => {
    console.log("statusLsdcvdfist", statusList);
  }, []);

  const { studentLog } = useSelector((state) => state.studentLog);
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");
  const [remarks, setRemarks] = useState("");
  const [updating, setUpdating] = useState(false);

  // useEffect(() => {
  //   dispatch(getStudentLog(student.id));
  // }, [student]);

  useEffect(() => {
    if (student) {
      console.log("student", student);
      setStatus(student.status || "Submitted");
      setRemarks(student.remarks || "");
    }
  }, [student]);

  const handleUpdate = async (logId) => {
    setUpdating(true);
    try {
      console.log("ID", student.id);
      await dispatch(patchStudentLog({ status, remarks, logId: student.id }));
    } catch (err) {
      alert("Failed to update.");
    } finally {
      setUpdating(false);
      onClose(true);
    }
  };

  const getStatusStyles = (status) => {
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

  const studentFields = [
    { label: "Father's Name", value: student.student.fatherName },
    { label: "Mobile", value: student.student.mobileNumber },
    { label: "Batch", value: student.student.batch },
    { label: "Session", value: student.student.session },
    { label: "Account Holder", value: student.student.accountHolderName },
    { label: "Account Number", value: student.student.accountNumber },
    { label: "Bank Name", value: student.student.bankName },
    { label: "Bank IFSC", value: student.student.ifsc },
    { label: "Relation", value: student.student.relationWithStudent },
    {
      label: "Date Of Admission",
      value: `${student.student.dateOfAdmission.split("T")[0]}`,
    },
    { label: "Deposit", value: `₹${student.student.cautionMoneyDeposited}` },
    { label: "Remarks By Student", value: `${student.student.remark}` },
  ];
  const studentDocuments = getDocumentList(student?.student?.document);

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs bg-opacity-40 z-50 flex items-center justify-center"
      onClick={() => onClose(false)}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl p-6 relative overflow-y-auto max-h-[92vh] border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => onClose(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-6 mb-6 pb-4 border-b border-gray-100">
          <div className="flex w-full pr-6 justify-between items-center gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-gray-800">
                {student.student.name}
              </h2>
              <p className="text-sm text-gray-500">
                Roll No: {student.student.rollNumber}
              </p>
            </div>
            <div
              className={`mt-1 inline-block px-2 py-1 rounded text-xs font-medium ${getStatusStyles(
                status
              )}`}
            >
              {status}
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-800 mb-6">
          {studentFields.map((field, index) => {
            if (
              field.value === undefined ||
              field.value === null ||
              field.value === ""
            )
              return null;
            return (
              field.value !== undefined && (
                <div
                  key={index}
                  className={`flex justify-between items-center p-3 rounded-xl ${
                    bgColors[index % bgColors.length]
                  }`}
                >
                  <span className="font-medium text-gray-700">
                    {field.label}
                  </span>
                  <span className="text-right">{field.value}</span>
                </div>
              )
            );
          })}
        </div>
        <div className="rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-800">
              Uploaded Document(s)
            </h3>
            <span className="text-xs text-gray-500">
              {studentDocuments.length} file(s)
            </span>
          </div>
          {studentDocuments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {studentDocuments.map((doc, index) => (
                <a
                  key={`${doc}-${index}`}
                  href={doc}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-lg border border-gray-200 p-2 hover:shadow-md transition"
                >
                  <img
                    src={doc}
                    alt={`Document ${index + 1}`}
                    className="w-full h-44 object-cover rounded-md border border-gray-100"
                  />
                  <span className="mt-2 block text-xs text-blue-700 font-medium">
                    Open Document {index + 1}
                  </span>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">
              No document uploaded by student.
            </p>
          )}
        </div>
        <div className="mt-4">
          <button
            onClick={handleDownloadFullFormPdf}
            className="bg-emerald-600 text-white px-5 py-2 rounded-md hover:bg-emerald-700 transition font-medium"
          >
            Download Full Form (PDF)
          </button>
        </div>

        {/* Remarks & Status */}
        <div className="space-y-4">
          {/* <div>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-gray-600">
                Select status
              </option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div> */}

          <div className="flex flex-col gap-2">
          {statusList &&   <label
              htmlFor="status"
              className="font-bold text-2xl text-gray-700 mb-1"
            >
              Change Status
            </label>}
            <div className="flex flex-wrap items-center gap-4">
              {(statusList || []).map((item) => (
                <label key={item} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="status"
                    value={item}
                    checked={status === item}
                    onChange={(e) => setStatus(e.target.value)}
                    className="form-radio text-blue-500 focus:ring-blue-500"
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label
              htmlFor="remarks"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Give Remarks
            </label>
            <textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add any remarks here..."
            ></textarea>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => onClose(false)}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            >
              {"Cancel"}
            </button>

            {console.log("Status", status)}
            <button
              onClick={() => handleUpdate(student.id)}
              disabled={!statusList?.includes(status) || updating}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            >
              {updating ? "Updating..." : "Submit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentModal;
