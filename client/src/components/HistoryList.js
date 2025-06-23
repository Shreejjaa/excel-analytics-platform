import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE from "../api";

const HistoryList = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUploads = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`${API_BASE}/api/excel/myuploads`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUploads(res.data.uploads);
      } catch (err) {
        setUploads([]);
        setError("Failed to fetch uploads. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload History</h2>
      {error && <div className="text-red-500">{error}</div>}
      {loading ? (
        <div>Loading...</div>
      ) : uploads.length === 0 ? (
        <div>No uploads found.</div>
      ) : (
        <table className="min-w-max w-full bg-white rounded-xl shadow-md">
          <thead>
            <tr>
              <th className="px-4 py-2 border">File Name</th>
              <th className="px-4 py-2 border">Upload Date</th>
              <th className="px-4 py-2 border">Rows</th>
              <th className="px-4 py-2 border">Download</th>
              <th className="px-4 py-2 border">AI Summary</th>
            </tr>
          </thead>
          <tbody>
            {uploads.map((file, idx) => (
              <tr key={idx}>
                <td className="px-4 py-2 border">{file.fileName}</td>
                <td className="px-4 py-2 border">{new Date(file.createdAt).toLocaleString()}</td>
                <td className="px-4 py-2 border">{file.data?.length || 0}</td>
                <td className="px-4 py-2 border">
                  <button
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      const res = await fetch(`http://localhost:5000/api/excel/download/${file._id}`, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      const blob = await res.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      let fileName = file.fileName;
                      if (!fileName || !fileName.endsWith('.xlsx')) {
                        fileName = (fileName ? fileName.replace(/\.[^/.]+$/, "") : "download") + ".xlsx";
                      }
                      a.download = fileName;
                      a.href = url;
                      a.click();
                      window.URL.revokeObjectURL(url);
                    }}
                  >
                    Download
                  </button>
                </td>
                <td className="px-4 py-2 border">
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={async () => {
                      const token = localStorage.getItem("token");
                      const res = await fetch(`http://localhost:5000/api/excel/summary/${file._id}`, {
                        method: "POST",
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      const data = await res.json();
                      alert(data.summary || data.message || data.error || "No summary available.");
                    }}
                  >
                    Generate Summary
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default HistoryList;