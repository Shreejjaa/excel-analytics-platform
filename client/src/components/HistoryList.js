import React, { useEffect, useState } from "react";
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
    </div>
  );
};

export default HistoryList;