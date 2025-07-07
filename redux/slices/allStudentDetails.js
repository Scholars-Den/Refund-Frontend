import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const getAllStudentDetails = createAsyncThunk(
  "allStudentDetails/getStudentDetails",
  async (_, { rejectWithValue }) => {
    try {
      const studentDetails = await axios.get(
        "/student",

        { withCredentials: true }
      );

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fatherContactNumber: userData.fatherContactNumber }
      //       );

      console.log("studentDetails", studentDetails);
      // document.cookie = `token=${adminLogin.data.token}; path=/; secure; samesite=strict`;
      // document.cookie = `role=${adminLogin.data.admin.role}; path=/; secure; samesite=strict`;

      if (studentDetails) {
        return {
          allStudentDetails: studentDetails.data.allStudent,
        };
      } else {
        return {
          allStudentDetails: {},
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

// Slice definition
const allStudentDetails = createSlice({
  name: "allStudentDetails",
  initialState: {
    allStudentDetails: {},
    loading: false,
    dataExist: false,
    message: "",
  },
  reducers: {
    updateAllStudentDetails(state, action) {
      state.allStudentDetails = {
        ...state.allStudentDetails,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllStudentDetails.fulfilled, (state, action) => {
      state.allStudentDetails = action.payload.allStudentDetails;
      state.loading = false;
    });
    builder.addCase(getAllStudentDetails.pending, (state) => {
      state.loading = true;
      state.dataExist = false;
    });
    builder.addCase(getAllStudentDetails.rejected, (state) => {
      state.allStudentDetails = {};
      state.loading = false;
    });
  },
});

export const { updateAllStudentDetails } = allStudentDetails.actions;
export default allStudentDetails.reducer;
