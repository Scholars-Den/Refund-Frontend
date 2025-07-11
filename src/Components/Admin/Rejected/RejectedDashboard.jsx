import React from "react";
import AdminSidebar from "../AdminSidebar";
import RejectedMain from "./RejectedMain";
import StudentStatusList from "../Pending/StudentStatusList";

// import AdminComponent from "./AdminComponent";

const   RejectedDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
            {/* <RejectedMain/> */}
                 <StudentStatusList statusFilter="Rejected" title="Rejected Students" statusList={[ "Dispersed"]} />

        </div>
      </div>
    </div>
  );
};

export default RejectedDashboard;
