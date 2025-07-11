import React from "react";
import AdminSidebar from "../AdminSidebar";
import ApprovedMain from "./ApprovedMain";
import StudentStatusList from "../Pending/StudentStatusList";

// import AdminComponent from "./AdminComponent";

const   ApprovedDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
            {/* <ApprovedMain/> */}
            <StudentStatusList statusFilter="Approved" title="Approved Students" statusList={[ "Dispersed"]} />


        </div>
      </div>
    </div>
  );
};

export default ApprovedDashboard;
