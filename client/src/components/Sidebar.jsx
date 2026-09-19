import React, { useState } from "react";
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  Image,
  Eraser,
  Scissors,
  FileCheck,
  Users,
  LogOut,
  ChevronUp,
} from "lucide-react";

import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { useClerk, useUser } from "@clerk/clerk-react";

const Sidebar = () => {
  const { user } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const [showLogout, setShowLogout] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { name: "Write Article", icon: <PenSquare size={20} />, path: "/write-article" },
    { name: "Blog Titles", icon: <FileText size={20} />, path: "/blog-titles" },
    { name: "Generate Images", icon: <Image size={20} />, path: "/generate-images" },
    { name: "Remove Background", icon: <Eraser size={20} />, path: "/remove-background" },
    { name: "Remove Object", icon: <Scissors size={20} />, path: "/remove-object" },
    { name: "Review Resume", icon: <FileCheck size={20} />, path: "/review-resume" },
    { name: "Community", icon: <Users size={20} />, path: "/community" },
  ];

  return (
    <div className="w-64 h-full bg-white border-r flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="border-b flex flex-col items-center py-8">
          <img
            src={assets.profile_img}
            alt=""
            className="w-20 h-20 rounded-full object-cover"
          />

          <h2 className="mt-3 text-lg font-semibold">
            Dhiraj Kumar
          </h2>

          <p className="text-sm text-gray-500">
            Full Stack Developer
          </p>
        </div>

        <div className="py-4">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3 transition ${
                  isActive
                    ? "bg-violet-600 text-white"
                    : "text-gray-700 hover:bg-violet-100"
                }`
              }
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </div>

      <div className="relative border-t shrink-0">
        {showLogout && (
          <div className="absolute bottom-full left-0 w-full bg-white border border-gray-200 rounded-t-lg shadow-md overflow-hidden">
            <button
              onClick={() => openUserProfile()}
              className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Manage Account
            </button>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        )}

        <div
          onClick={() => setShowLogout((prev) => !prev)}
          className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-50"
        >
          <div className="flex items-center gap-3 min-w-0">
            <img
              src={user?.imageUrl}
              alt=""
              className="w-9 h-9 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">
                {user?.fullName || "Guest"}
              </p>
              <p className="text-xs text-gray-500">Premium Plan</p>
            </div>
          </div>

          <ChevronUp
            className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${
              showLogout ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;