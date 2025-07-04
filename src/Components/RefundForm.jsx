import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { useDispatch, useSelector } from "react-redux";
import { submitStudentDetails } from "../../redux/slices/studentDetails";
import Header from "./Header";
import Declaration from "./Declaration";
import { ConfirmationPage } from "./ConfirmationPage";

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
    cautionMoneyDeposited: "",
    remark: "",
    document: "",
  });
  const [documentUrl, setDocumentUrl] = useState(""); // Cloudinary URL

  const [isConfirming, setIsConfirming] = useState(false);

  const [isUploading, setIsUploading] = useState(false); // Add this

  // const { studentDetails } = useSelector((state) => studentDetails);

  const handleInitialSubmit = (e) => {
    e.preventDefault();

    const isValid = validate();
    if (!isValid || !agreed) return;

    setIsConfirming(true); // Show confirmation page
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      const { document, ...studentDetails } = formData;

      const payload = {
        ...studentDetails,
        cautionMoneyDeposited:
          parseInt(
            formData.cautionMoneyDeposited.toString().replace(/[^0-9.]/g, "")
          ) || 0,
        dateOfAdmission: new Date(formData.dateOfAdmission),
        session: parseInt(formData.session) || null,
        document: documentUrl,
      };

      const res = await dispatch(submitStudentDetails(payload));

      if (res.meta.requestStatus === "fulfilled") {
        navigate("/submitted");
      } else {
        throw new Error("Failed to submit form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showPopup(
        "Something went wrong while submitting. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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
      if (field === "remark") {
        continue;
      }
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

      if (field === "cautionMoneyDeposited") {
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

      if (field === "document") {
        if (!documentUrl) {
          formErrors[field] = "Please upload bank details document.";
          isValid = false;
        }
      }
    }

    console.log("formErrors", formErrors);
    if (!isValid) {
      const firstErrorKey = Object.keys(formErrors)[0];
      const firstErrorMessage = formErrors[firstErrorKey];
      showPopup(firstErrorMessage, "error");
    }
    setErrors(formErrors);
    return isValid;
  };

  const uploadToCloudinary = async (file) => {
    setIsUploading(true);

    const cloudName = "dtytgoj3f";
    const uploadPreset = "Refund Form";

    // Create a dynamic file name based on student name and timestamp
    const timestamp = Date.now();
    // const studentMobileNumber = studentDetails.mobileNumber.replace(
    //   /\s+/g,
    //   "_"
    // ); // Replace spaces
    // console.log("studentMobileNumber", studentMobileNumber);
    // const fileName = `RefundAppliocation/${studentMobileNumber}`; // Folder + unique name

    const formDataCloud = new FormData();
    formDataCloud.append("file", file);
    formDataCloud.append("upload_preset", uploadPreset);
    // formDataCloud.append("public_id", fileName); // <- This sets the file name in Cloudinary

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        {
          method: "POST",
          body: formDataCloud,
        }
      );

      const data = await response.json();
      if (data.secure_url) {
        setDocumentUrl(data.secure_url);
        showPopup("Document uploaded successfully!", "success");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Cloudinary upload failed", error);
      showPopup(
        "Something went wrong while uploading. Please try again.",
        "error"
      );
    } finally {
      setIsUploading(false);
    }
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

      // STEP 1: Upload document to Cloudinary

      // STEP 2: Prepare data to send to backend (URL only, not file)
      const { document, ...studentDetails } = formData;
      const payload = {
        ...studentDetails,
        cautionMoneyDeposited:
          parseInt(
            formData.cautionMoneyDeposited.toString().replace(/[^0-9.]/g, "")
          ) || 0,
        dateOfAdmission: new Date(formData.dateOfAdmission),
        session: parseInt(formData.session) || null,
        document: documentUrl, // use pre-uploaded Cloudinary URL
      };

      // STEP 3: Dispatch Redux thunk with JSON (not FormData now)
      const res = await dispatch(submitStudentDetails(payload));

      if (res.meta.requestStatus === "fulfilled") {
        navigate("/submitted");
      } else {
        throw new Error("Failed to submit form.");
      }
    } catch (error) {
      console.error("Submission error:", error);
      showPopup(
        "Something went wrong while submitting. Please try again.",
        "error"
      );
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
          <h1 className="text-2xl md:text-3xl font-bold  uppercase tracking-wide">
            Caution Money Refund Application
          </h1>
        </div>

        {isConfirming ? (
          <ConfirmationPage
            formData={formData}
            documentUrl={documentUrl}
            onEdit={() => setIsConfirming(false)}
            onConfirm={handleFinalSubmit}
            isSubmitting={isSubmitting}
          />
        ) : (
          // The existing form
          <form onSubmit={handleInitialSubmit} className="mt-8 space-y-6">
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
              label="Caution Money deposited"
              name="cautionMoneyDeposited"
              type="text"
              value={formData.cautionMoneyDeposited}
              onChange={handleChange}
              error={errors.cautionMoneyDeposited}
            />
            <Input
              label="Remark"
              name="remark"
              value={formData.remark}
              onChange={handleChange}
            />

            <div className="mt-6">
              <label
                htmlFor="document"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Upload Bank account details - Cancelled cheque or First page of
                passbook.
              </label>
              <div className="text-sm text-gray-600 bg-gray-50 border border-gray-200 rounded-md p-4 mb-3">
                Please upload a clear image or scanned copy of the bank account
                details document. <br />
                <span className="font-semibold text-gray-700 block mt-2">
                  Allowed file types: JPG, JPEG, PNG
                </span>
                <span className="font-semibold text-gray-700 block">
                  Max size: 2MB
                </span>
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
                    ⚠️ Submitting bank details of anyone other than the student
                    or their parent/guardian will lead to rejection of the form.
                  </li>
                </ul>
              </div>

              <input
                type="file"
                id="document"
                name="document"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const allowedTypes = [
                      "image/jpeg",
                      "image/png",
                      "image/jpg",
                    ];
                    const maxSizeMB = 2;

                    if (!allowedTypes.includes(file.type)) {
                      showPopup(
                        "Only JPG, JPEG, or PNG files are allowed.",
                        "error"
                      );
                      return;
                    }

                    if (file.size > maxSizeMB * 1024 * 1024) {
                      showPopup("File size must be less than 2MB.", "error");
                      return;
                    }

                    setFormData((prev) => ({ ...prev, document: file }));
                    uploadToCloudinary(file);
                  }
                }}
                className="block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />

              {isUploading ? (
                <div className="mt-3 text-sm text-blue-600 flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-blue-600"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                  Uploading document...
                </div>
              ) : documentUrl ? (
                <div className="mt-3">
                  <p className="text-sm text-green-600">
                    Document uploaded successfully.
                  </p>
                  <img
                    src={documentUrl}
                    alt="Uploaded Document"
                    className="mt-2 h-32 rounded-md border"
                  />
                </div>
              ) : null}

              {errors.document && (
                <p className="text-red-500 text-sm mt-1">{errors.document}</p>
              )}
            </div>

            <Declaration
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />

            <div className="flex justify-end pt-6">
              <button
                type="submit"
                disabled={isSubmitting || !agreed || isUploading}
                className={`py-2 px-6 rounded-md text-white font-medium transition duration-200 ${
                  isSubmitting || !agreed || isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        )}

    
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
