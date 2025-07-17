import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import scholarsDenLogo from "../../assets/scholarsdenLogo.png";
import { fetchAdminDetails } from "../../../redux/slices/adminDetails";

const AdminSidebar = () => {
  const { adminDetails } = useSelector((state) => state.adminDetails);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sidebarElementList = {
    ADMIN: [
      { to: "/pending", text: "Pending" },
      { to: "/rejected", text: "Rejected" },
      { to: "/approved", text: "Approved" },
      { to: "/disburse", text: "Disburse" },
    ],
    cashier: [
      { to: "/cashierDashboard", text: "Approved" },
      { to: "/amountPaid", text: "Paid" },
    ],
    counsellor: [{ to: "/consellorDashboard", text: "Assigned" }],
    accounts: [{ to: "/accountsDashboard", text: "Amount Paid" }],
    admissionHead: [{ to: "/admissionHeadDasboard", text: "Admission Taken" }],
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    navigate("/admin");
  };

  const role = adminDetails?.role;

  useEffect(() => {
    dispatch(fetchAdminDetails());
  }, []);

  useEffect(() => {
    console.log("adminDetails", adminDetails);
  }, [adminDetails]);
  const formatRoleName = (role) => {
    if (!role) return "";
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // console.log("role", formatRoleName(role));

  return (
    <div className="flex flex-col justify-between h-screen pt-4 md:w-full bg-gray-100 shadow-2xl text-black ">
      <div className="flex flex-col gap-8 justify-center items-center">
        <div className="flex flex-col gap-1 items-center">
          <img className="w-16 h-16" src={scholarsDenLogo} alt="Scholars Den" />
          <span className=" text-center mt-3">
            {role && `${formatRoleName(role)} Dashboard`}
          </span>
          <div className="flex gap-2">
            {/* <span className="text-black"> Name : </span> */}
            <span className=" "> {adminDetails?.name} </span>
          </div>
        </div>

        <div className="flex flex-col gap-7 w-full justify-end items-end">
          {sidebarElementList[role]?.map((element, index) => (
            <Link
              key={index}
              to={element.to}
              className={`flex gap-3 w-5/6 items-end rounded-l-full p-3 transition-all duration-200 ${
                location.pathname === element.to ? "text-red-600 bg-white" : ""
              }`}
            >
              <h4>{element.text}</h4>
            </Link>
          ))}
        </div>

        <div className="cursor-pointer mt-4" onClick={handleLogout}>
          Logout
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
