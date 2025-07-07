import { configureStore } from '@reduxjs/toolkit';
// import formDataReducer from "./formDataSlice"
// import loadingDetailsReducer from "./loadingSlice"
// import alreadyExistStudentReducer from "./alreadyExistStudentSlice"
import adminDetailsReducer from "./slices/adminDetails"
import studentDetailsReducer from "./slices/studentDetails"
import allStudentDetailsReducer from "./slices/allStudentDetails"
import studentLogReducer from "./slices/studentLog"



// Configure Redux Store
const store = configureStore({
  reducer: {
    // Adding each slice to the store
    // userDetails: formDataReducer,
    // loadingDetails: loadingDetailsReducer,
    // alreadyExistStudent: alreadyExistStudentReducer,
    studentDetails : studentDetailsReducer,
    adminDetails : adminDetailsReducer,
    allStudentDetails : allStudentDetailsReducer,
    studentLog : studentLogReducer
    
  },
});

export default store;
