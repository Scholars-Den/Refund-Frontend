import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getStudentLog,
  patchStudentLog,
  updateStudentLog,
} from "../../../../redux/slices/studentLog";

const StudentModal = ({ student, onClose, statusList }) => {
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
      case "Dispersed":
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
    { label: "Bank Name", value: student.student.bankName },
    { label: "Bank IFSC", value: student.student.ifsc },
    { label: "Relation", value: student.student.relationWithStudent },
    { label: "Deposit", value: `₹${student.student.cautionMoneyDeposited}` },
  ];

  return (
    <div
      className="fixed inset-0 backdrop-blur-xs bg-opacity-40 z-50 flex items-center justify-center"
      onClick={()=>onClose(false)}
    >
      <div
        className="bg-white rounded-lg max-w-xl w-full shadow-xl p-6 relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={()=>onClose(false)}
          className="absolute top-3 right-4 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
        >
          ×
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <img
              src={student.student.document}
              alt={`${student.name}'s document`}
              className="w-20 h-20 rounded-full object-cover border-4 border-gray-200"
            />
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">
                {student.name}
              </h2>
              <p className="text-sm text-gray-500">
                Roll No: {student.rollNumber}
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
          {studentFields.map((field, index) => (
            <div
              key={index}
              className={`flex justify-between items-center p-3 rounded-xl ${
                bgColors[index % bgColors.length]
              }`}
            >
              <span className="font-medium text-gray-700">{field.label}</span>
              <span className="text-right">{field.value}</span>
            </div>
          ))}
        </div>

        {/* Remarks & Status */}
        <div className="space-y-4">
          {/* <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Change Status
            </label>
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

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>

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
              Remarks
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
              onClick={()=>onClose(false)}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-60"
            >
              {"Cancel"}
            </button>
            <button
              onClick={() => handleUpdate(student.id)}
              disabled={updating}
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
