import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import Spinner from "../components/Spinner";
import Layout from "../components/Layout";
import "react-toastify/dist/ReactToastify.css";

const Upload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token");
    if (!token) return toast.warn("You're not logged in. Please log in first.");

    try {
      setUploading(true);
      const res = await fetch("http://localhost:5000/api/excel/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Upload successful!");
        setFile(null);
      } else {
        toast.error(`Upload failed: ${data.message}`);
      }
    } catch {
      toast.error("Something went wrong during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md mx-auto text-center">
        <h2 className="text-2xl font-bold mb-6 text-green-600">📤 Upload Excel File</h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-xl px-4 py-2"
            disabled={uploading}
          />
          {file && (
            <div className="text-left text-sm text-gray-600 mt-2">
              <span className="font-semibold">Selected:</span> {file.name} ({(file.size / 1024).toFixed(1)} KB)
              <button type="button" onClick={() => setFile(null)} className="ml-2 text-red-500 hover:underline">Remove</button>
            </div>
          )}
          <button
            type="submit"
            disabled={uploading || !file}
            className="w-full bg-green-500 text-white py-2 rounded-xl font-semibold hover:bg-green-600 transition-all duration-300 shadow-md hover:scale-[1.02] disabled:opacity-50"
          >
            {uploading ? <Spinner /> : "Upload"}
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </Layout>
  );
};

export default Upload;