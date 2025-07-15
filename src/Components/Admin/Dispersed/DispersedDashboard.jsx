import React from "react";
import AdminSidebar from "../AdminSidebar";
import DispersedMain from "./DispersedMain";
import StudentStatusList from "../Pending/StudentStatusList";

// import AdminComponent from "./AdminComponent";

const DispersedDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
          {/* <DispersedMain/> */}
          <StudentStatusList
            statusFilter="Dispersed"
            title="Dispersed Students"
            // statusList={["Approved", "Rejected"]}
          />
        </div>
      </div>
    </div>
  );
};

export default DispersedDashboard;
