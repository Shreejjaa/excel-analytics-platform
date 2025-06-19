import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";

const HistoryList = () => {
  const [uploads, setUploads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUploads = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://localhost:5000/api/excel/myuploads", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUploads(data.uploads || []);
      } catch (err) {
        setUploads([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUploads();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-xl font-bold mb-4">Upload History</h2>
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
                        alert(data.summary || "No summary available.");
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
      </main>
    </div>
  );
};

export default HistoryList;