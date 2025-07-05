import React from "react";
import AdminSidebar from "../AdminSidebar";
import PendingMain from "./PendingMain";

// import AdminComponent from "./AdminComponent";

const PendingDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
            <PendingMain/>

        </div>
      </div>
    </div>
  );
};

export default PendingDashboard;
