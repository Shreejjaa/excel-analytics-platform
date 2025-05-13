import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [uploads, setUploads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/excel/myuploads", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setUploads(data.uploads || []))
      .catch((err) => console.error("Error fetching uploads:", err));
  }, []);

  const totalFiles = uploads.length;
  const recentUpload = uploads[0];

  return (
    <div className="dashboard-container" style={{ padding: "2rem" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "1rem" }}>📊 Dashboard</h2>
      <p>Welcome back! Here’s a summary of your recent activity.</p>

      <button
        onClick={() => navigate("/upload")}
        style={{
          marginTop: "1rem",
          padding: "0.6rem 1rem",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        ➕ Upload New File
      </button>

      <div className="card" style={{ marginTop: "2rem" }}>
        <h3>📁 Total Files Uploaded</h3>
        <p>{totalFiles}</p>
      </div>

      {recentUpload && (
        <div className="card" style={{ marginTop: "1rem" }}>
          <h3>🕒 Last Upload</h3>
          <p>{recentUpload.fileName}</p>
        </div>
      )}

      <div className="card" style={{ marginTop: "1rem" }}>
        <h3>📝 Recent Uploads</h3>
        <ul>
          {uploads.slice(0, 5).map((file, idx) => (
            <li key={idx}>{file.fileName}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
