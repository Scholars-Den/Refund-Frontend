import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchAdminDetails = createAsyncThunk(
  "adminDetails/fetchAdminDetails",
  async (_, { rejectWithValue }) => {
    try {
      const adminData = await axios.get(
        "/user",
       { withCredentials: true }
      );

      console.log("adminData", adminData);

      if (adminData) {
        return {
          adminDetails: adminData.data.admin,
        };
      } else {
        return {
          adminDetails: {},
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

export const submitAdminDetails = createAsyncThunk(
  "adminDetails/submitAdminDetails",
  async (mobileNumber, { rejectWithValue }) => {
    try {
      console.log("adminDetails", adminDetails);

      const adminLogin = await axios.post(
        "/auth/login",
        {
          mobileNumber,
        },
        { withCredentials: true }
      );

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fatherContactNumber: userData.fatherContactNumber }
      //       );

      console.log("adminLogin", adminLogin);
      // document.cookie = `token=${adminLogin.data.token}; path=/; secure; samesite=strict`;
      // document.cookie = `role=${adminLogin.data.admin.role}; path=/; secure; samesite=strict`;

      if (adminLogin) {
        return {
          message: adminLogin.data.message,
        };
      } else {
        return {
          adminDetails: {},
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
const adminDetails = createSlice({
  name: "adminDetails",
  initialState: {
    adminDetails: {},
    loading: false,
    dataExist: false,
    message : ""
  },
  reducers: {
    updateAdminDetails(state, action) {
      state.adminDetails = { ...state.adminDetails, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAdminDetails.fulfilled, (state, action) => {
      state.adminDetails = action.payload.adminDetails;
    });
    builder.addCase(fetchAdminDetails.pending, (state) => {
      state.loading = true;
      state.dataExist = false;
    });
    builder.addCase(fetchAdminDetails.rejected, (state) => {
      state.adminDetails = {};
    });
    builder.addCase(submitAdminDetails.pending, (state) => {
      state.loading = true;
      state.dataExist = false;
    });
    builder.addCase(submitAdminDetails.fulfilled, (state, action) => {
      state.adminDetails = action.payload.adminDetails;
      state.message = action.payload.message
    });
    builder.addCase(submitAdminDetails.rejected, (state) => {
      state.adminDetails = {};
    });
  },
});

export const { updateAdminDetails } = adminDetails.actions;
export default adminDetails.reducer;
