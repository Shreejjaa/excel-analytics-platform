import React, { useState } from "react";

const PasswordSection = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    // In a real app, send oldPassword and newPassword to backend here
    alert("Password changed successfully (demo only)!");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow max-w-md">
      <h3 className="font-semibold mb-4">Change Password</h3>
      <form onSubmit={handleChangePassword} className="space-y-4">
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Old Password"
          value={oldPassword}
          onChange={e => setOldPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
        >
          Change Password
        </button>
      </form>
    </section>
  );
};

export default PasswordSection;