import "./App.css";
// import Signup from "./Components/Signup";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./../redux/store";
import RefundForm from "./Components/RefundForm";
import LockNavigation from "../utils/LockNavigation";
import SubmittedPage from "./Components/SubmittedPage";
import Login from "./Components/Login";
import AlreadyExist from "./Components/AlreadyExist";
import AdminSignup from "./Components/AdminSignup";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import PendingDashboard from "./Components/Admin/Pending/PendingDashboard";
import RejectedDashboard from "./Components/Admin/Rejected/RejectedDashboard";
import DispersedDashboard from "./Components/Admin/Dispersed/DispersedDashboard";

function App() {
  return (
    <Provider store={store}>
    <Router>
      <LockNavigation />

      <Routes>
        {/* Public Routes */}
        <Route path="/form" element={<RefundForm />} />
        <Route path="/submitted" element={<SubmittedPage />} />
        <Route path="/" element={<Login />} />
        <Route path="/alreadyExist" element={<AlreadyExist />} />
        <Route path="/adminsignup" element={<AdminSignup />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/pending" element={<PendingDashboard />} />
        <Route path="/rejected" element={<RejectedDashboard />} />
        <Route path="/dispersed" element={<DispersedDashboard />} />

        {/* Protected Routes for authenticated users */}
        {/* <Route
            path="/familyDetails"
            element={
              <ProtectedRouteForStudent>
                <FamilyComponents />
              </ProtectedRouteForStudent>
            }
          /> */}
      </Routes>
    </Router>
     </Provider>
  );
}

export default App;
