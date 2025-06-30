import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../api/axios";
import TermsAndConditionPage from "../src/Components/TermsAndConditionPage";

export const fetchStudentDetails = createAsyncThunk(
  "studentDetails/fetchStudentDetails",
  async (_, { rejectWithValue }) => {
    try {
      console.log("Fetching user details...");
      const response = await axios.get("/api/student");
      console.log("response", response);

      const data = response.result;

      if (data) {
        // Ensure siblings array always has a length of 4
        // const siblings = data?.siblings || [];
        // const filledSiblings = [
        //   ...siblings,
        //   ...Array(4 - siblings.length).fill({}),
        // ];

        return {
          dataExist: true, // Data exists
        };
      } else {
        return {
          dataExist: false,
          formData: {},
        };
      }
    } catch (error) {
      console.log("Error from fetchUserDetails", error);
      return rejectWithValue(
        error.response?.data || "Failed to fetch user details"
      );
    }
  }
);

export const submitBankRefundForm = createAsyncThunk(
  "userDetails/submitBankRefundForm",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.patch("/admissions/submitBankRefundForm");
      console.log("response from submitBankRefundForm", response);

      const data = response.data;
      if (data.length !== 0) {
        return {
          dataExist: true, // Indicate data exists
          studentDetails: {
            data.name,
            data.fatherName,
            data.rollNumber,
            data.dateOfAdmission,
            data.session,
            data.accountHolderName,
            data.accountNumber,
            data.ifsc,
            data.bankName,
            data.relationWithStudent,
            data.amountDeposit,
            data.remark,
          },
        };
      } else {
        console.log("Testdata from redux", data);
        return;
      }
    } catch (error) {
      console.log("error .,.....,,,,,,,,,", error);
      return;
    }
  }
);
// export const submitBankRefundForm = createAsyncThunk(
//   "userDetails/submitBankRefundForm",
//   async (formData, { rejectWithValue }) => {
//     try {
//       console.log("formData from submitBankRefundForm", formData);
//       const response = await axios.patch(
//         "/admissions/submitBankRefundForm",
//         formData
//       );
//       console.log("response from submitBankRefundForm", response);

//       const data = response.data;
//       if (data.length !== 0) {
//         return {
//           dataExist: true, // Indicate data exists
//           userData: {
//             accountHolder: data?.accountHolder || "",
//             acknowledgementNumber: data?.acknowledgementNumber || "",
//             admissionRollNo: data?.admissionRollNo || "",
//             enrollmentNumber: data?.enrollmentNumber || "",
//             studentClass: data?.studentClass || "",
//             program: data?.program || "",
//             bankName: data?.bankName || "",
//             accountNumber: data?.accountNumber || "",
//             ifscCode: data?.ifscCode || "",
//             relationWithStudent: data?.relationWithStudent || "",

//             signatures: {
//               admissionOfficer: data?.accountNumber || "",
//               parent: data?.accountNumber || "",
//             },
//           },
//         };
//       }else{

//         console.log("Testdata from redux", data);
//         return;
//       }
//     } catch (error) {
//       console.log("error .,.....,,,,,,,,,", error);
//       return;
//     }
//   }
// );

export const submitFormData = createAsyncThunk(
  "userDetails/submitFormData",
  async (formData, { rejectWithValue }) => {
    try {
      console.log("formData from submitFormData", formData);
      const response = await axios.post(
        "/admissions/createAdmission",
        formData
      );

      document.cookie = `token=${response.data.token}`;

      console.log("response from submitsuserDetails", response);

      const data = response.data;
      console.log("Message from submitFormData", data.message);
      console.log("Data.length", data);
      if (data) {
        return {
          dataExist: true, // Indicate data exists
          message: data.message || "",
          userData: {
            studentName: data?.newAdmission?.studentName || "",
            aadhaarID: data?.newAdmission?.aadhaarID || "",
            studentContactNumber:
              data?.newAdmission?.studentContactNumber || "",
            gender: data?.newAdmission?.gender || "",
            category: data?.newAdmission?.Category || "",
            dob: data?.newAdmission?.dob || "",
            bloogGroup: data?.newAdmission?.bloogGroup || "",
            scholarship: data?.newAdmission?.scholarship || "",
            termsAndCondition: data?.TermsAndCondition || "",
            studentClass: data?.newAdmission?.studentClass || "",
            program: data?.newAdmission?.program || "",

            fatherName: data?.newAdmission?.fatherName || "",
            fatherAadhaarID: data?.newAdmission?.fatherAadhaarID || "",
            fatherDob: data?.newAdmission?.fatherDob || "",
            fatherBloodGroup: data?.newAdmission?.fatherBloodGroup || "",
            fatherOccupations: data?.newAdmission?.fatherOccupatoions || "",
            motherName: data?.newAdmission?.motherName || "",
            motherAadhaarID: data?.newAdmission?.motherAadhaarID || "",
            motherDob: data?.newAdmission?.motherDob || "",
            motherBloodGroup: data?.newAdmission?.motherBloodGroup || "",
            motherOccupations: data?.newAdmission?.motherOccupations || "",

            cancelledCheque: data?.cancelledCheque || "",
            passbook: data?.passbook || "",
            studentAadhaar: data?.studentAadhaar || "",
            parentAadhaar: data?.parentAadhaar || "",
            passbookPhoto: data?.passbookPhoto || "",
          },
        };
      } else {
        return {
          dataExist: false, // Indicate no data exists
          formData: {}, // Default empty data
          message: "",
        };
      }
    } catch (error) {
      console.log("error from submitFormData", error);
      // window.location.reload();
      return rejectWithValue(
        error.response?.data || "Failed to update user details"
      );
    }
  }
);
export const putFormData = createAsyncThunk(
  "userDetails/putFormData",
  async (formData, { rejectWithValue }) => {
    console.log("formData from submitFormData", formData);
    try {
      console.log("formData from submitFormData", formData);
      const response = await axios.patch("/admissions/putFormData", formData);

      console.log("response from submitsuserDetails", response);

      const data = response.data.user;

      if (data.length !== 0) {
        return {
          dataExist: true, // Indicate data exists
          userData: {
            studentName: data?.studentName || "",
            aadhaarID: data?.aadhaarID || "",
            studentContactNumber: data?.studentContactNumber || "",

            gender: data?.gender || "",
            category: data?.Category || "",
            dob: data?.dob || "",
            bloogGroup: data?.bloogGroup || "",
            scholarship: data?.scholarship || "",
            termsAndCondition: data?.TermsAndCondition || "",

            fatherName: data?.fatherName || "",
            fatherAadhaarID: data?.fatherAadhaarID || "",
            fatherDob: data?.fatherDob || "",
            fatherBloodGroup: data?.fatherBloodGroup || "",
            fatherOccupations: data?.fatherOccupatoions || "",
            motherName: data?.motherName || "",
            motherAadhaarID: data?.motherAadhaarID || "",
            motherDob: data?.motherDob || "",
            motherBloodGroup: data?.motherBloodGroup || "",
            motherOccupations: data?.motherOccupations || "",
            studentPhoto: data?.newAdmission?.studentPhoto || "",

            cancelledCheque: data?.cancelledCheque || "",
            passbook: data?.passbook || "",
            studentAadhaar: data?.studentAadhaar || "",
            parentAadhaar: data?.parentAadhaar || "",
            passbookPhoto: data?.passbookPhoto || "",
          },
        };
      } else {
        return {
          dataExist: false, // Indicate no data exists
          formData: {}, // Default empty data
        };
      }
    } catch (error) {
      console.log("error from submitFormData", error);

      return rejectWithValue(
        error.response?.data || "Failed to update user details"
      );
    }
  }
);

export const submitSiblingsDetails = createAsyncThunk(
  "form/submitSiblingsDetails",
  async (formData, { rejectWithValue }) => {
    console.log("formData from submitSiblingsDetails", formData);
    try {
      const response = await axios.patch(
        `/admissions/submitSiblingsDetails`,
        formData
      );

      console.log("response from submitSiblingsDetails", response);
      return response.data;
    } catch (error) {
      console.log("error form submitSiblingsDetails", error);
      return rejectWithValue(error.response.data);
    }
  }
);

// Slice
const formDataSlice = createSlice({
  name: "userDetails",
  initialState: {
    userData: {},
    message: "",
    loading: false,
    userDataError: null,
    dataExist: false, // New flag to indicate if data exists in the database
  },
  reducers: {
    updateUserDetails(state, action) {
      state.userData = { ...state.userData, ...action.payload };
    },

    updateSiblingDetails: (state, action) => {
      const { index, name, value } = action.payload;
      state.userData.siblings[index] = {
        ...state.userData.siblings[index],
        [name]: value,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitFormData.pending, (state) => {
        state.loading = true;
        state.userDataError = null;
      })
      .addCase(submitFormData.fulfilled, (state, action) => {
        console.log("action.payload", action.payload.message);
        state.loading = false;
        state.message = action.payload.message;
        state.userData = action.payload.userData;
        state.dataExist = action.payload.dataExist;
      })
      .addCase(submitFormData.rejected, (state, action) => {
        state.loading = false;
        state.userData = {};
        state.userDataError = action.payload;
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.userDataError = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userData = action.payload.userData;
        state.dataExist = action.payload.dataExist;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.userDataError = action.payload;
      });
  },
});

export const { updateUserDetails, updateSiblingDetails } =
  formDataSlice.actions;
export default formDataSlice.reducer;
