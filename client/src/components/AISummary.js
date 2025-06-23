import React, { useState } from "react";
import axios from "axios";

const AISummary = ({ uploadId }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const getSummary = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const res = await axios.post(
      `http://localhost:5000/api/excel/summary/${uploadId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    setSummary(res.data.summary);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={getSummary} disabled={loading}>
        {loading ? "Loading..." : "Get AI Summary"}
      </button>
      {summary && <div><h3>AI Summary:</h3><p>{summary}</p></div>}
    </div>
  );
};

export default AISummary;
