import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUploads = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/excel/myuploads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setUploads(data.uploads || []);
    };
    fetchUploads();
  }, []);

  const totalFiles = uploads.length;
  const excelFiles = uploads.filter(f => f.fileName.endsWith('.xls') || f.fileName.endsWith('.xlsx')).length;
  const csvFiles = uploads.filter(f => f.fileName.endsWith('.csv')).length;
  const avgRows = uploads.length ? Math.round(uploads.reduce((sum, f) => sum + (f.data?.length || 0), 0) / uploads.length) : 0;

  const logActivity = (icon, text) => {
    setRecentActivity(prev => [
      { icon, text, time: new Date().toLocaleString() },
      ...prev.slice(0, 9)
    ]);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Sidebar />
      <main className="flex-1 p-8">
        <h2 className="text-xl font-bold mb-4">Welcome to the Dashboard!</h2>
        {/* Recent Files */}
        <section className="mb-8">
          <h2 className="text-xl font-bold mb-4">Recent Files</h2>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {uploads.slice(0, 4).map((file, idx) => (
              <div key={idx} className="bg-white rounded-xl shadow p-4 min-w-[200px] flex flex-col items-center">
                <div className="text-4xl mb-2">📄</div>
                <div className="font-semibold">{file.fileName}</div>
                <div className="text-xs text-gray-500 mb-2">{file.data?.length || 0} rows • {file.data && file.data[0] ? Object.keys(file.data[0]).length : 0} columns</div>
                <div className="text-xs text-gray-400 mb-2">{new Date(file.createdAt).toLocaleString()}</div>
                <div className="flex gap-2">
                  <button
                    className="text-green-700 hover:underline"
                    onClick={() => {
                      logActivity("👁️", `Viewed ${file.fileName}`);
                      window.location.href = `/analyze/${file._id}`;
                    }}
                  >
                    View
                  </button>
                  <button
                    className="text-blue-700 hover:underline"
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
                      logActivity("⬇️", `Downloaded ${file.fileName}`);
                    }}
                  >
                    Download
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            className="mt-4 px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200"
            onClick={() => window.location.href = "/history"}
          >
            View All Files
          </button>
        </section>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <section className="md:col-span-2 bg-white rounded-xl shadow p-6">
            <h3 className="font-bold mb-4">Recent Activity</h3>
            <ul>
              {recentActivity.map((item, idx) => (
                <li key={idx} className="mb-2 flex items-center gap-2">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                  <span className="text-xs text-gray-400 ml-2">{item.time}</span>
                </li>
              ))}
            </ul>
          </section>
          {/* Quick Insights */}
          <section className="bg-white rounded-xl shadow p-6">
            <h3 className="font-bold mb-4">Quick Insights</h3>
            <div className="mb-2">📈 <b>Data Growth:</b> {totalFiles} total files</div>
            <div className="mb-2">📊 <b>File Distribution:</b> {excelFiles} Excel, {csvFiles} CSV</div>
            <div className="mb-2">💾 <b>Data Volume:</b> {avgRows} avg rows/file</div>
            <div className="mb-2">⏰ <b>Activity Patterns:</b> Most active on Friday</div>
            <div>⭐ <b>Popular Content:</b> None yet</div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;