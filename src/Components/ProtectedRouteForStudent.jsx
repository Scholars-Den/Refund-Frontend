// src/Components/ProtectedRoute.js
import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getCookie } from "../../utils/cookieUtils";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentDetails } from "../../redux/slices/studentDetails";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const { studentDetails } = useSelector((state) => state.studentDetails);

  useEffect(() => {
    dispatch(fetchStudentDetails());
  }, []);
  useEffect(() => {
    console.log("studentDetaisl", studentDetails);
    console.log("studentDetaisl", !studentDetails);
  }, [studentDetails]);


  if (studentDetails) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
