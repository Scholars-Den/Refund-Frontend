import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const getStudentLog = createAsyncThunk(
  "studentLog/getStudentLog",
  async ({ page = 1, limit = 10, status }, { rejectWithValue }) => {
    try {
      const studentLogDetails = await axios.get("/statusLog/pending", {
        params: {
          status: status, // Optional
          page,
          limit,
        },
        withCredentials: true,
      });

    

      console.log("studentLogDetails", studentLogDetails);

      if (studentLogDetails) {
        return {
          studentLog: studentLogDetails.data.data,
          totalPages: studentLogDetails.data.totalPages
        };
      } else {
        return {
          studentLog: {},
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

export const patchStudentLog = createAsyncThunk(
  "studentLog/updateStudentLog",
  async (data, { rejectWithValue }) => {
    try {
      console.log("Data from patch", data);
      const patchData = await axios.patch(
        `/statusLog`,
        data,

        { withCredentials: true }
      );

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fatherContactNumber: userData.fatherContactNumber }
      //       );

      console.log("patchData", patchData);
      // document.cookie = `token=${adminLogin.data.token}; path=/; secure; samesite=strict`;
      // document.cookie = `role=${adminLogin.data.admin.role}; path=/; secure; samesite=strict`;

      if (patchData) {
        return {
          studentLog: patchData.data,
        };
      } else {
        return {
          studentLog: {},
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
const studentLog = createSlice({
  name: "studentLog",
  initialState: {
    studentLog: [],
    totalPages: 1,
    loading: false,
    error: null,
  },
  reducers: {
    updateStudentLog(state, action) {
      state.studentLog = {
        ...state.studentLog,
        ...action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getStudentLog.fulfilled, (state, action) => {
      state.studentLog = action.payload.studentLog;
      state.loading = false;
      state.totalPages = action.payload.totalPages;
    });
    builder.addCase(getStudentLog.pending, (state) => {
      state.loading = true;
      state.dataExist = false;
    });
    builder.addCase(getStudentLog.rejected, (state) => {
      state.studentLog = {};
      state.loading = false;
    });
  },
});

export const { updateStudentLog } = studentLog.actions;
export default studentLog.reducer;
