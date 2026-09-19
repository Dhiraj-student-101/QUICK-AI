import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="h-screen flex flex-col ">
    <Navbar />

    <div className="flex flex-1 pt-20 overflow-hidden">
        <Sidebar />

        <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
            <Outlet />
        </div>
    </div>
</div>
  );
};

export default Layout;