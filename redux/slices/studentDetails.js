import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchStudentDetails = createAsyncThunk(
  "studentDetails/fetchStudentDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/student/studentByForm");

      console.log("studentDetails", response);

      if (response) {
        return {
          studentDetails: response.data.result,
        };
      } else {
        return {
          studentDetails: {},
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

export const submitStudentDetails = createAsyncThunk(
  "studentDetails/submitStudentDetails",
  async (studentDetails, { rejectWithValue }) => {
    try {
      console.log("studentDetails", studentDetails);

      const studentLogin = await axios.post("/student/create", {
        studentDetails,
      });

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fathermobileNumber: userData.fathermobileNumber }
      //       );

      console.log("studentLogin", studentLogin);
      document.cookie = `token=${studentLogin.data.token}; path=/; secure; samesite=strict`;
      document.cookie = `role=${studentLogin.data.admin.role}; path=/; secure; samesite=strict`;

      if (studentLogin) {
        return {
          studentDetails: studentLogin.student,
        };
      } else {
        return {
          studentDetails: {},
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

export const createInitialStudent = createAsyncThunk(
  "studentDetails/createInitialStudent",
  async (mobileNumber, { rejectWithValue }) => {
    try {
      console.log("studentDetails", mobileNumber);

      const studentLogin = await axios.post("/student/createInitialStudent", {
        mobileNumber,
      });

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fathermobileNumber: userData.fathermobileNumber }
      //       );

      console.log("studentLogin", studentLogin);
      document.cookie = `token=${studentLogin.data.token}; path=/; secure; samesite=strict`;

      if (studentLogin) {
        return {
          studentDetails: studentLogin.data,
        };
      } else {
        return {
          studentDetails: {},
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
const studentDetails = createSlice({
  name: "studentDetails",
  initialState: {
    studentDetails: {},
    loading: false,
    dataExist: false,
  },
  reducers: {
    updateStudentDetails(state, action) {
      console.log("test data ", state, action);
      state.studentDetails = { ...state.studentDetails, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchStudentDetails.fulfilled, (state, action) => {
      state.studentDetails = action.payload.studentDetails;
    });
    builder.addCase(fetchStudentDetails.pending, (state) => {
      state.loading = true;
      state.dataExist = false;
    });
    builder.addCase(fetchStudentDetails.rejected, (state) => {
      state.studentDetails = {};
    });
    builder.addCase(submitStudentDetails.pending, (state) => {
      state.loading = true;
      state.dataExist = false;
    });
    builder.addCase(submitStudentDetails.fulfilled, (state, action) => {
      state.studentDetails = action.payload.studentDetails;
    });
    builder.addCase(submitStudentDetails.rejected, (state) => {
      state.studentDetails = {};
    });
    builder.addCase(createInitialStudent.pending, (state) => {
      state.loading = true;
      state.dataExist = false;
    });
    builder.addCase(createInitialStudent.fulfilled, (state, action) => {
      state.studentDetails = action.payload.studentDetails;
    });
    builder.addCase(createInitialStudent.rejected, (state) => {
      state.studentDetails = {};
    });
  },
});

export const { updateStudentDetails } = studentDetails.actions;
export default studentDetails.reducer;
