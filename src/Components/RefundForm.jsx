import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useDispatch } from "react-redux";
import { submitStudentDetails } from "../../redux/slices/studentDetails";
import Header from "./Header";
import Declaration from "./Declaration";
const RefundForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    rollNumber: "",
    dateOfAdmission: "",
    session: "",
    batch: "",
    accountHolderName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    relationWithStudent: "",
    amountDeposit: "",
    remark: "",
    document: "",
  });
  const dispatch = useDispatch();
  const [agreed, setAgreed] = useState(false);

  const [batchOptions, setBatchOptions] = useState([]);

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showPopup = (message, type) => {
    setModalInfo({ message, type });
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log("e.target", e.target.name, e.target.value);
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === "string" && !value.trim()) {
        newErrors[key] = "This field is required";
      } else if (value === "" || value === null || value === undefined) {
        newErrors[key] = "This field is required";
      }
    });

    if (formData.amountDeposit && isNaN(formData.amountDeposit)) {
      newErrors.amountDeposit = "Amount must be a number";
    }

    if (formData.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) {
      newErrors.ifsc = "Invalid IFSC code";
    }

    return newErrors;
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsSubmitting(true);

  //   const validationErrors = validate();
  //   if (Object.keys(validationErrors).length > 0) {
  //     setErrors(validationErrors);
  //     setIsSubmitting(false);
  //     return;
  //   }

  //   try {
  //     const token = localStorage.getItem("token");

  //     // Prepare FormData
  //     const formDataToSend = new FormData();
  //     formDataToSend.append("image", formData.document); // file field

  //     // Remove the file from payload, and send JSON string of the rest
  //     const { document, ...studentDetails } = formData;

  //     formDataToSend.append(
  //       "studentDetails",
  //       JSON.stringify({
  //         ...studentDetails,
  //         amountDeposit: parseInt(formData.amountDeposit),
  //         dateOfAdmission: new Date(formData.dateOfAdmission),
  //         session: parseInt(formData.session),
  //       })
  //     );

  //     // Send POST request
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_APP_SCHOLARSDEN_API_URL}/api/student/create`,
  //       formDataToSend,
  //       {
  //         headers: {
  //           "Content-Type": "multipart/form-data",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (response.status === 200) {
  //       navigate("/submitted");
  //     } else {
  //       throw new Error("Failed to submit form.");
  //     }
  //   } catch (error) {
  //     console.error("Submission error:", error);
  //     showPopup("Something went wrong. Please try again.", "error");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    console.log("handle submit function working");

    const validationErrors = validate();
    console.log("validationErrors", validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      console.log("validationErrors occur");
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Prepare FormData
      const formDataToSend = new FormData();

      console.log("formData.document", formData.document);
      await formDataToSend.append("image", formData.document); // file field

      // Remove the file from payload, and send JSON string of the rest
      const { document, ...studentDetails } = formData;

      formDataToSend.append(
        "studentDetails",
        JSON.stringify({
          ...studentDetails,
          amountDeposit: parseInt(formData.amountDeposit),
          dateOfAdmission: new Date(formData.dateOfAdmission),
          session: parseInt(formData.session),
        })
      );
      console.log("Selected file:", formData.document);

      const res = await dispatch(submitStudentDetails(formDataToSend));
      console.log("res", res);

      if (res.meta.requestStatus === "fulfilled") {
        navigate("/submitted");
      } else {
        throw new Error("Failed to submit form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showPopup("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const formValid = Object.values(formData).every((val) => val.trim() !== "");

  // Define options for Session and Batch
  // const sessionOptions = ["2021", "2022", "2023", "2024", "2025"];
  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  const sessionOptions = Array.from(
    { length: currentYear + 1 - startYear },
    (_, i) => (currentYear - i).toString()
  );

  const options = async () => {
    const allOptions = await axios.get(
      `${import.meta.env.VITE_APP_SCHOLARSDEN_API_URL}/api/batch`
    );
    // const allOptions = await axios.get(`https://api.scholarsden.in/api/batch`);
    setBatchOptions(allOptions.data.getAllData);

    console.log("allOptions", allOptions);
  };


  const formatRupees = (amount) => {
    console.log("amount", amount);
    if (!amount) return "";
    const number = parseFloat(amount.replace(/[^0-9]/g, ""));
    if (isNaN(number)) return "";
    return `${number.toLocaleString("en-IN")}`;
  };

  useEffect(() => {
    options();
    // console.log("options")
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100  sm:px-4 ">
      <div className="w-full max-w-3xl bg-white shadow-xl px-3 sm:px-5 py-5   ">
        <Header />
   <div className="mt-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 uppercase tracking-wide">
            Caution Money Refund Application
          </h1>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Student Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Student Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={errors.name}
            />
            <Input
              label="Father's Name"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              error={errors.fatherName}
            />
            <Input
              label="Roll Number"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              error={errors.rollNumber}
            />
            <Input
              label="Date of Admission"
              name="dateOfAdmission"
              type="date"
              value={formData.dateOfAdmission}
              onChange={handleChange}
              error={errors.dateOfAdmission}
            />
            <Select
              label="Session"
              name="session"
              value={formData.session}
              onChange={handleChange}
              options={sessionOptions}
              error={errors.session}
            />
            <SelectBatch
              label="Batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              options={batchOptions}
            />
          </div>

          {/* Bank Details */}
          <h2 className="text-lg font-semibold text-gray-800 mt-8 mb-2">
            Bank Details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Account Holder Name"
              name="accountHolderName"
              value={formData.accountHolderName}
              onChange={handleChange}
              error={errors.accountHolderName}
            />
            <Input
              label="Account Number"
              name="accountNumber"
              value={formData.accountNumber}
              onChange={handleChange}
              error={errors.accountNumber}
            />
            <Input
              label="IFSC Code"
              name="ifsc"
              value={formData.ifsc}
              onChange={handleChange}
              error={errors.ifsc}
            />
            <Input
              label="Bank Name"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              error={errors.bankName}
            />
          </div>
          <Input
            label="Relation With Student"
            name="relationWithStudent"
            value={formData.relationWithStudent}
            onChange={handleChange}
            error={errors.relationWithStudent}
          />
          <Input
            label="Amount Deposit"
            name="amountDeposit"
            type="text"
            value={formatRupees(formData.amountDeposit)}
            onChange={handleChange}
            error={errors.amountDeposit}
          />
          <Input
            label="Remark"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            error={errors.remark}
          />

          {/* Upload Section */}
          <div className="mt-6">
            <label
              htmlFor="document"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Upload Bank Details Document
            </label>
            <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-4 mb-3">
              Please upload a clear image or scanned copy of the bank account
              details document.
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Only bank details of the <strong>student</strong> or their{" "}
                  <strong>parent/legal guardian</strong> are allowed.
                </li>
                <li>
                  Document must clearly show:
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Account Holder's Name</li>
                    <li>Account Number</li>
                    <li>IFSC Code</li>
                    <li>Bank Name</li>
                  </ul>
                </li>
                <li className="text-red-600 font-medium mt-2">
                  ⚠️ Submitting bank details of anyone other than the student or
                  their parent/guardian will lead to rejection of the form.
                </li>
              </ul>
            </div>

            <input
              type="file"
              id="document"
              name="document"
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  document: e.target.files[0],
                }))
              }
              className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {/* Submit Button */}
          <Declaration
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />

          {console.log("validate", validate())}
          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting || !agreed}
              className={`py-2 px-6 rounded-md text-white font-medium transition duration-200
    ${
      isSubmitting || !agreed
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>

      {/* Success/Error Toast */}
      {showModal && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-md z-50 w-80 border-l-4 shadow-lg transition-all duration-300
          ${
            modalInfo.type === "success"
              ? "bg-green-50 border-green-500 text-green-700"
              : "bg-red-50 border-red-500 text-red-700"
          }`}
        >
          <p className="font-semibold">{modalInfo.message}</p>
        </div>
      )}
    </div>
  );
};

const Input = ({ label, name, type = "text", value, onChange, error }) => (
  <div className="bg-green-50 p-4 rounded-xl">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-200"
      }`}
      required
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const Select = ({ label, name, value, onChange, options, error }) => (
  <div className="bg-green-50 p-4 rounded-xl">
    <label
      htmlFor={name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 ${
        error
          ? "border-red-500 focus:ring-red-300"
          : "border-gray-300 focus:ring-blue-200"
      }`}
      required
    >
      <option value="" disabled>
        Select {label}
      </option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectBatch = ({ label, name, value, onChange, options }) => (
  <div className="bg-green-50 p-4 rounded-xl">
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">Select {label}</option>
      {options?.map((option, index) => (
        <option key={index} value={`${option.name} (${option.batch})`}>
          {option.name} ({option.batch})
        </option>
      ))}
    </select>
  </div>
);

export default RefundForm;
