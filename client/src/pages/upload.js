import React, { useState } from "react";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You are not logged in. Please log in first.");
      return;
    }

    try {
      setUploading(true);

      const res = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // ✅ Secure token
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Upload Successful!");
        console.log("Server Response:", data);
      } else {
        alert("❌ Upload failed: " + data.message);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-pink-100 px-4">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in text-center">
        <h2 className="text-2xl font-bold mb-6 text-purple-600">📤 Upload Excel File</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={handleFileChange}
            className="w-full border rounded-xl px-4 py-2"
          />
          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-purple-500 text-white py-2 rounded-xl font-semibold hover:bg-purple-600 transition-all duration-300 shadow-md hover:scale-[1.02] disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      {/* Fade-in animation */}
      <style>{`
        .animate-fade-in {
          animation: fadeIn 0.7s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Upload;
