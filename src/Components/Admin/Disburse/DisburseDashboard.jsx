import React from "react";
import AdminSidebar from "../AdminSidebar";
import DisburseMain from "./DisburseMain";
import StudentStatusList from "../Pending/StudentStatusList";

// import AdminComponent from "./AdminComponent";

const DisburseDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
          {/* <DisburseMain/> */}
          <StudentStatusList
            statusFilter="Disburse"
            title="Disburse Students"
            // statusList={["Approved", "Rejected"]}
          />
        </div>
      </div>
    </div>
  );
};

export default DisburseDashboard;
