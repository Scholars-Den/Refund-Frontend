import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchStudentDetails = createAsyncThunk(
  "studentDetails/fetchStudentDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/student/studentByForm", {
          withCredentials: true 
      });

      console.log("studentDetails fgrg", response);

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
  async (formDataToSend, { rejectWithValue }) => {
    try {
      console.log("formDataToSend", formDataToSend);

      const studentLogin = await axios.post("/student/create", formDataToSend, {
        withCredentials: "true",
      });

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fathermobileNumber: userData.fathermobileNumber }
      //       );

      console.log("student from submitStudentDetails", studentLogin);

      if (studentLogin) {
        return {
          studentDetails: studentLogin.data.student,
          message: studentLogin.data.message,
        };
      } else {
        return {
          studentDetails: {},
        };
      }
    } catch (error) {
      console.log("Error from fetchUserDetails", error);
      console.log("Error from fetchUserDetails", error.message);
      window.alert("Error form: " + error.message);
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
      },
     { withCredentials: true }
    );

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
    message: "",
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
      state.loading = false;
    });
    builder.addCase(fetchStudentDetails.pending, (state) => {
      state.loading = true;
      state.dataExist = false;
    });
    builder.addCase(fetchStudentDetails.rejected, (state) => {
      state.studentDetails = {};
      state.loading = false;
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
