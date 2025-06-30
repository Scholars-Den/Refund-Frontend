import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";

const RefundForm = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState({ message: "", type: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    rollNumber: "",
    dateOfAdmission: "",
    session: "",
    accountHolderName: "",
    accountNumber: "",
    ifsc: "",
    bankName: "",
    relationWithStudent: "",
    amountDeposit: "",
    remark: "",
  });

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

  const showPopup = (message, type) => {
    setModalInfo({ message, type });
    setShowModal(true);
    setTimeout(() => setShowModal(false), 3000);
  };

  const validate = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (!value.trim()) newErrors[key] = "This field is required";
    });

    if (formData.amountDeposit && isNaN(formData.amountDeposit)) {
      newErrors.amountDeposit = "Amount must be a number";
    }

    if (formData.ifsc && !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifsc)) {
      newErrors.ifsc = "Invalid IFSC code";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      await axios.post("/student/create", {
        ...formData,
        amountDeposit: parseInt(formData.amountDeposit),
        dateOfAdmission: new Date(formData.dateOfAdmission),
        session: new Date(formData.session),
      });
      navigate("/submitted");
    } catch (error) {
        console.log("error ", error);
      showPopup("Something went wrong. Please try again.", "error");
      setIsSubmitting(false);
    }
  };

  const formValid =
    Object.values(formData).every((val) => val.trim() !== "") &&
    !Object.keys(validate()).length;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100 px-4">
      <div className="w-full max-w-2xl bg-gray-100 shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Refund Application Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Input
            label="Session Start Date"
            name="session"
            type="date"
            value={formData.session}
            onChange={handleChange}
            error={errors.session}
          />
          <Input
            label="Remark"
            name="remark"
            value={formData.remark}
            onChange={handleChange}
            error={errors.remark}
          />
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
            type="number"
            value={formData.amountDeposit}
            onChange={handleChange}
            error={errors.amountDeposit}
          />
    
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !formValid}
              className={`py-2 px-6 rounded-md transition duration-200 text-white ${
                isSubmitting || !formValid
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
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-md z-50 w-80 border-l-4 shadow-lg
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
  <div>
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

export default RefundForm;
