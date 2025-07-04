import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useDispatch } from "react-redux";
import { submitStudentDetails } from "../../redux/slices/studentDetails";
import Header from "./Header";
import Declaration from "./Declaration";

const RefundForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    // document: "",
  });

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
    const formErrors = {};
    let isValid = true;

    for (const field of Object.keys(formData)) {
      const value = formData[field];

      if (
        (typeof value === "string" && !value.trim()) ||
        value === "" ||
        value === null ||
        value === undefined
      ) {
        formErrors[field] = `${field.replace(/([A-Z])/g, " $1")} is required.`;
        isValid = false;
        continue;
      }

      if (field === "amountDeposit") {
        const cleanValue = value.toString().replace(/[^0-9.]/g, "");
        if (isNaN(cleanValue)) {
          formErrors[field] = "Amount must be a valid number.";
          isValid = false;
        }
      }

      if (field === "ifsc") {
        const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
        if (!ifscRegex.test(value)) {
          formErrors[field] = "Invalid IFSC code.";
          isValid = false;
        }
      }

      // if (field === "document") {
      //   if (!formData.document || !(formData.document instanceof File)) {
      //     formErrors[field] = "Bank details document is required.";
      //     isValid = false;
      //   }
      // }
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validate();
    if (!isValid || !agreed) {
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const formDataToSend = new FormData();

      formDataToSend.append("image", formData.document);

      const { document, ...studentDetails } = formData;

      formDataToSend.append(
        "studentDetails",
        JSON.stringify({
          ...studentDetails,
          amountDeposit:
            parseInt(
              formData.amountDeposit.toString().replace(/[^0-9.]/g, "")
            ) || 0,
          dateOfAdmission: new Date(formData.dateOfAdmission),
          session: parseInt(formData.session) || null,
        })
      );

      const res = await dispatch(submitStudentDetails(formDataToSend));

      if (res.meta.requestStatus === "fulfilled") {
        navigate("/submitted");
      } else {
        throw new Error("Failed to submit form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showPopup("Something went wrong. Please try again.", error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const startYear = 2024;
  const currentYear = new Date().getFullYear();
  const sessionOptions = Array.from(
    { length: currentYear + 1 - startYear },
    (_, i) => (currentYear - i).toString()
  );

  const getBatchOptions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_APP_SCHOLARSDEN_API_URL}/api/batch`
      );
      setBatchOptions(res.data.getAllData);
    } catch (err) {
      console.error("Error fetching batch options", err);
    }
  };

  useEffect(() => {
    getBatchOptions();
  }, []);

  const formatRupees = (amount) => {
    if (!amount) return "";
    const number = parseFloat(amount.toString().replace(/[^0-9]/g, ""));
    if (isNaN(number)) return "";
    return `${number.toLocaleString("en-IN")}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 sm:px-4">
      <div className="w-full max-w-3xl bg-white shadow-xl px-3 sm:px-5 py-5">
        <Header />
        <div className="mt-6 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 uppercase tracking-wide">
            Caution Money Refund Application
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
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
              error={errors.batch}
            />
          </div>

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
            value={formData.amountDeposit}
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

          {/* <div className="mt-6">
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
            />
            {errors.document && (
              <p className="text-red-500 text-sm mt-1">{errors.document}</p>
            )}
          </div> */}

          <Declaration
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />

          <div className="flex justify-end pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`py-2 px-6 rounded-md text-white font-medium transition duration-200 ${
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

      {showModal && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-md z-50 w-80 border-l-4 shadow-lg transition-all duration-300 ${
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
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

const SelectBatch = ({ label, name, value, onChange, options, error }) => (
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
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);

export default RefundForm;
