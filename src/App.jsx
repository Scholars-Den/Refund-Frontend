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
        {/* <Route path="/adminsignup" element={<AdminSignup />} /> */}

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
