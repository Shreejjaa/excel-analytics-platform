import React from "react";

const DangerZone = () => {
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This cannot be undone.")) {
      localStorage.removeItem("user");
      // Remove other user-related data if needed
      window.location.href = "/register";
    }
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow max-w-md border border-red-300">
      <h3 className="font-semibold mb-4 text-red-600">Danger Zone</h3>
      <button
        className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition"
        onClick={handleDeleteAccount}
      >
        Delete Account
      </button>
      <p className="mt-2 text-sm text-red-500">
        Deleting your account is irreversible. All your data will be lost.
      </p>
    </section>
  );
};

export default DangerZone;
