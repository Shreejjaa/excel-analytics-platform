import React, { useState, useEffect } from "react";

const PreferencesSection = () => {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [notifications, setNotifications] = useState(
    localStorage.getItem("notifications") === "true"
  );

  // Apply theme to <body> or <html>
  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleSavePreferences = (e) => {
    e.preventDefault();
    localStorage.setItem("theme", theme);
    localStorage.setItem("notifications", notifications);
    alert("Preferences saved!");
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow max-w-md">
      <h3 className="font-semibold mb-4">Preferences</h3>
      <form onSubmit={handleSavePreferences} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Theme</label>
          <select
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={theme}
            onChange={e => setTheme(e.target.value)}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div>
          <label className="block font-semibold mb-1">Notifications</label>
          <input
            type="checkbox"
            checked={notifications}
            onChange={e => setNotifications(e.target.checked)}
            className="mr-2"
          />
          <span>Enable email notifications</span>
        </div>
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
        >
          Save Preferences
        </button>
      </form>
    </section>
  );
};

export default PreferencesSection;
