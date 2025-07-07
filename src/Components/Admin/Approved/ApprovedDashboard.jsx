import React from "react";
import AdminSidebar from "../AdminSidebar";
import ApprovedMain from "./ApprovedMain";

// import AdminComponent from "./AdminComponent";

const   ApprovedDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
            <ApprovedMain/>

        </div>
      </div>
    </div>
  );
};

export default ApprovedDashboard;
