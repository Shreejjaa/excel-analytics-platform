import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || "User";
  return (
    <aside className="bg-green-700 dark:bg-gray-800 text-white w-64 min-h-screen flex flex-col justify-between py-6 px-4">
      <div>
        <h1 className="text-2xl font-bold mb-10">Excel-Analytics-platform</h1>
        <nav className="flex flex-col gap-6">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/upload" className="hover:underline">Upload Files</Link>
          <Link to="/analyze" className="hover:underline">Analyze Data</Link>
          <Link to="/history" className="hover:underline">History List</Link>
          <Link to="/settings" className="hover:underline">Settings</Link>
        </nav>
      </div>
      <div className="mb-2">
        <div className="mb-1">{username} <span className="text-xs bg-white text-green-700 px-2 py-0.5 rounded ml-2">user</span></div>
        <button
          className="text-red-300 hover:underline"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;