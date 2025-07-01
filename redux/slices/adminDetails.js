import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../api/axios";

export const fetchAdminDetails = createAsyncThunk(
  "adminDetails/fetchAdminDetails",
  async (adminDetails, { rejectWithValue }) => {
    try {
      const adminData = await axios.get("/user/adminByMobileNumber", adminDetails);



      console.log("adminData", adminData);

      if (adminData) {
        return {
          adminDetails: adminData.data.data,
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
  async (contactNumber, { rejectWithValue }) => {
    try {
      console.log("adminDetails", adminDetails);

      const adminLogin = await axios.post("/admission-admin/login", {
        contactNumber,
      });

      // const alreadyExistStudent = await axios.post(
      //         "/user/getStudentByPhone",
      //         { fatherContactNumber: userData.fatherContactNumber }
      //       );

      console.log("adminLogin", adminLogin);
      document.cookie = `token=${adminLogin.data.token}; path=/; secure; samesite=strict`;
      document.cookie = `role=${adminLogin.data.admin.role}; path=/; secure; samesite=strict`;

      if (adminLogin) {
        return {
          adminDetails: adminLogin.data.admin,
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
    });
    builder.addCase(submitAdminDetails.rejected, (state) => {
      state.adminDetails = {};
    });
  },
});

export const { updateAdminDetails } = adminDetails.actions;
export default adminDetails.reducer;
