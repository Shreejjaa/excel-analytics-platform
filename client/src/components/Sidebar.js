<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.username || user?.name || "User";
  const profilePicture = user?.profilePicture;
  const role = user?.role || "user";
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Fetch notifications count when sidebar mounts or location changes
    const fetchUnread = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await fetch("/api/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const count = Array.isArray(data) ? data.filter(n => !n.read).length : 0;
        setUnreadCount(count);
      } catch {
        setUnreadCount(0);
      }
    };
    fetchUnread();
  }, [location]);

=======
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const username = user?.name || "User";
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
  return (
    <aside className="bg-green-700 dark:bg-gray-800 text-white w-64 min-h-screen flex flex-col justify-between py-6 px-4">
      <div>
        <h1 className="text-2xl font-bold mb-10">Excel-Analytics-platform</h1>
        <nav className="flex flex-col gap-6">
          <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          <Link to="/upload" className="hover:underline">Upload Files</Link>
          <Link to="/analyze" className="hover:underline">Analyze Data</Link>
          <Link to="/history" className="hover:underline">History List</Link>
<<<<<<< HEAD
          <Link to="/notifications" className="hover:underline flex items-center gap-2 relative">
            Notifications
            {unreadCount > 0 && (
              <span className="ml-1 bg-red-500 text-white text-xs rounded-full px-2 py-0.5 absolute -right-4 top-0 animate-pulse">
                {unreadCount}
              </span>
            )}
          </Link>
=======
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
          <Link to="/settings" className="hover:underline">Settings</Link>
        </nav>
      </div>
      <div className="mb-2">
<<<<<<< HEAD
        <div className="flex items-center mb-2">
          {profilePicture ? (
            <img 
              src={profilePicture} 
              alt="Profile" 
              className="w-8 h-8 rounded-full mr-2"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-white text-green-700 flex items-center justify-center text-sm font-bold mr-2">
              {username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-sm font-medium">{username}</div>
            <span className="text-xs bg-white text-green-700 px-2 py-0.5 rounded">{role}</span>
          </div>
        </div>
        <button
          className="text-red-300 hover:underline text-sm"
=======
        <div className="mb-1">{username} <span className="text-xs bg-white text-green-700 px-2 py-0.5 rounded ml-2">user</span></div>
        <button
          className="text-red-300 hover:underline"
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
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