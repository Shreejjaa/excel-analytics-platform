import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import axios from "axios";

const HistoryList = () => {
  const [uploads, setUploads] = useState([]);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');
  const [loadingSummaryId, setLoadingSummaryId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get('/api/excel/myuploads', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setUploads(res.data.uploads || []))
      .catch(error => {
        setError('Failed to fetch uploads.');
      });
  }, []);

  const handleDownload = async (id, fileName) => {
    const token = localStorage.getItem("token");
    const res = await axios.get(`/api/excel/download/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName.endsWith('.xlsx') ? fileName : fileName.replace(/\.[^/.]+$/, "") + ".xlsx";
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  const handleAISummary = async (id) => {
    setLoadingSummaryId(id);
    setSummary('');
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(`/api/excel/summary/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSummary(res.data.summary);
    } catch (err) {
      setSummary('Failed to get summary.');
    }
    setLoadingSummaryId(null);
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    console.log("Deleting upload with id:", id);
    await axios.delete(`/api/excel/upload/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setUploads(uploads.filter(u => u._id !== id));
  };

  if (error) return <div>{error}</div>;
  if (!uploads.length) return <div>No uploads found.</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload History</h2>
      <table className="min-w-full bg-white dark:bg-gray-900 rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">File Name</th>
            <th className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">Upload Date</th>
            <th className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">Rows</th>
            <th className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">Download</th>
            <th className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">AI Summary</th>
            <th className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">Delete</th>
          </tr>
        </thead>
        <tbody>
          {uploads.map(upload => (
            <tr key={upload._id}>
              <td className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">{upload.fileName}</td>
              <td className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">{new Date(upload.createdAt).toLocaleString()}</td>
              <td className="py-2 px-4 border-b text-gray-900 dark:text-gray-100">{upload.data ? upload.data.length : 0}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => handleDownload(upload._id, upload.fileName)}
                >
                  Download
                </button>
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-green-600 dark:text-green-400 hover:underline"
                  onClick={() => handleAISummary(upload._id)}
                  disabled={loadingSummaryId === upload._id}
                >
                  {loadingSummaryId === upload._id ? "Loading..." : "AI Summary"}
                </button>
                {summary && loadingSummaryId === null && (
                  <div className="mt-2 text-xs text-gray-700 dark:text-gray-200">{summary}</div>
                )}
              </td>
              <td className="py-2 px-4 border-b">
                <button
                  className="text-red-600 dark:text-red-400 hover:underline"
                  onClick={() => handleDelete(upload._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
=======
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
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
    </div>
  );
};

export default HistoryList;