import React from "react";

import AdminSidebar from "./AdminSidebar";
// import AdminComponent from "./AdminComponent";

const AdminDashboard = () => {
  return (
    <div className="">
      <div className="grid grid-cols-6 flex-col">
        <div className="col-span-1">
          <AdminSidebar />
        </div>
        <div className="col-span-5 flex-grow w-full ">
            {/* <AdminComponent/> */}

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
