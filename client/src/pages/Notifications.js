import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

const typeIcons = {
  update: (
    <span className="text-blue-500">🔔</span>
  ),
  news: (
    <span className="text-green-500">📰</span>
  ),
  delete: (
    <span className="text-red-500">🗑️</span>
  ),
};

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setNotifications(data);
      setLoading(false);
    };
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`/api/notifications/${id}/read`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` },
    });
    setNotifications((prev) =>
      prev.map((n) => (n._id === id ? { ...n, read: true } : n))
    );
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-2xl font-bold mb-6">Notifications</h2>
        {loading ? (
          <div>Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="text-gray-500">No notifications.</div>
        ) : (
          <ul className="space-y-4 max-w-2xl">
            {notifications.map((n) => (
              <li
                key={n._id}
                className={`flex items-start gap-4 p-4 rounded-xl shadow bg-white border-l-4 ${
                  n.type === "update"
                    ? "border-blue-400"
                    : n.type === "news"
                    ? "border-green-400"
                    : "border-red-400"
                } ${!n.read ? "bg-blue-50" : "opacity-70"}`}
              >
                <div className="text-2xl mt-1">{typeIcons[n.type] || "🔔"}</div>
                <div className="flex-1">
                  <div className="font-semibold text-lg">{n.title}</div>
                  <div className="text-gray-700 mb-1">{n.message}</div>
                  <div className="text-xs text-gray-400 mb-1">
                    {new Date(n.createdAt).toLocaleString()}
                  </div>
                  {n.link && (
                    <a
                      href={n.link}
                      className="text-blue-600 underline text-xs"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View more
                    </a>
                  )}
                </div>
                {!n.read && (
                  <button
                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-xs"
                    onClick={() => markAsRead(n._id)}
                  >
                    Mark as read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default Notifications; 