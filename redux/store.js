import { configureStore } from '@reduxjs/toolkit';
// import formDataReducer from "./formDataSlice"
// import loadingDetailsReducer from "./loadingSlice"
// import alreadyExistStudentReducer from "./alreadyExistStudentSlice"
// import adminDetailsReducer from "./adminDetailsSlice"


// Configure Redux Store
const store = configureStore({
  reducer: {
    // Adding each slice to the store
    // userDetails: formDataReducer,
    // loadingDetails: loadingDetailsReducer,
    // alreadyExistStudent: alreadyExistStudentReducer,
    // adminDetails : adminDetailsReducer
    
  },
});

export default store;
