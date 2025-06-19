import React, { useState } from "react";

const ProfileSection = () => {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email || "");

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem("user", JSON.stringify({ ...user, name, email }));
    alert("Profile updated!");
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow max-w-md">
      <h3 className="font-semibold mb-4">Profile</h3>
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Username</label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Save Profile
        </button>
      </form>
    </section>
  );
};

export default ProfileSection;