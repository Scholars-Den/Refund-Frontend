// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";
// import axios from "../api/axios.js";

// export const downloadExcelForRefund = async (
//   statusFilter,
//   startDate,
//   endDate
// ) => {
//   const response = await axios.get("/statusLog/downloadExcelData", {
//     params: {
//       status: statusFilter,
//       startDate,
//       endDate,
//     },
//   });

//   const showFilteredData = response.data.data;
//   console.log("showFilterData", showFilteredData);

//   if (!showFilteredData || showFilteredData.length === 0) {
//     alert("No data to export!");
//     return;
//   }

//   const formatDate = (isoDate) => {
//     const date = new Date(isoDate);
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
//   };

//   console.log("showFilteredData", showFilteredData);

//   // Use Promise.all to wait for all async operations to complete
//   const filteredExportData = await Promise.all(
//     showFilteredData.map(async (student, index) => {


//       const data = student.student;

//       return {
//         "Sr. No": index + 1,
//         RollNumber: data.rollNumber,
//         StudentName: data.name,
//         MobileNumber: student.mobileNumber,
//         FatherName: data.fatherName,
//         Session: data.session,
//         RelationWithStudent: data.relationWithStudent,
//         Document: data.document,
//         DateOfAdmission: data.dateOfAdmission,
//         IFSC: data.ifsc,
//         AccountHolderName: data.accountHolderName,
//         AccountNumber: data.accountNumber,
//         BankName: data.bankName,
//         Batch: data.batch,
//         CautionMoneyDeposited: data.cautionMoneyDeposited,
//         DateOfAdmission: data.dateOfAdmission,
//         Session: data.session,
//       };
//     })
//   );

//   // Now filteredExportData is a fully resolved array of objects
//   const worksheet = XLSX.utils.json_to_sheet(filteredExportData);
//   const workbook = XLSX.utils.book_new();
//   XLSX.utils.book_append_sheet(workbook, worksheet, `${startDate}_${endDate}_${statusFilter}`);

//   const excelBuffer = XLSX.write(workbook, {
//     bookType: "xlsx",
//     type: "array",
//   });

//   const data = new Blob([excelBuffer], { type: "application/octet-stream" });
//   saveAs(data, `Caution_Money_Data_${startDate}_${endDate}_${statusFilter}.xlsx`);
// };





import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import axios from "../api/axios.js";



  export const formatDate = (isoDate) => {
      if (!isoDate) return "";
      const date = new Date(isoDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

export const downloadExcelForRefund = async (
  statusFilter,
  startDate,
  endDate
) => {
  try {
    const response = await axios.get("/statusLog/downloadExcelData", {
      params: {
        status: statusFilter,
        startDate,
        endDate,
      },
    });

    const showFilteredData = response.data.data;
    if (!showFilteredData || showFilteredData.length === 0) {
      alert("No data to export!");
      return;
    }

  

    const formattedStart = formatDate(startDate) || "Start";
    const formattedEnd = formatDate(endDate) || "End";
    const safeStatus = statusFilter
      ? statusFilter.replace(/[^a-zA-Z0-9]/g, "_")
      : "All";

    const sheetName = `${safeStatus}_${formattedStart}_to_${formattedEnd}`.slice(
      0,
      31
    );

    const fileName = `Caution_Money_${safeStatus}_${formattedStart}_to_${formattedEnd}.xlsx`;

    const filteredExportData = showFilteredData.map((student, index) => {
      const data = student.student;

      return {
        "Sr. No": index + 1,
        RollNumber: data.rollNumber || "",
        StudentName: data.name || "",
        MobileNumber: student.mobileNumber || "",
        FatherName: data.fatherName || "",
        Session: data.session || "",
        RelationWithStudent: data.relationWithStudent || "",
        Document: data.document || "",
        DateOfAdmission: formatDate(data.dateOfAdmission),
        IFSC: data.ifsc || "",
        AccountHolderName: data.accountHolderName || "",
        AccountNumber: data.accountNumber || "",
        BankName: data.bankName || "",
        Batch: data.batch || "",
        CautionMoneyDeposited: data.cautionMoneyDeposited || "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(filteredExportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(data, fileName);
  } catch (error) {
    console.error("Error downloading Excel:", error);
    alert("Failed to download Excel data.");
  }
};
