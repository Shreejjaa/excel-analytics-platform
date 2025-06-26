import React, { useState } from "react";
import axios from "axios";

function AISummary({ analysis, buttonClassName = "" }) {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const getSummary = async () => {
    setLoading(true);
    const res = await axios.post("/api/excel/ai-summary", { analysis });
    setSummary(res.data.summary);
    setLoading(false);
  };

  return (
    <div>
      <button onClick={getSummary} disabled={loading} className={buttonClassName}>
        {loading ? "Summarizing..." : "Get AI Summary"}
      </button>
      {summary && <div className="summary-box mt-4 p-4 rounded bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 shadow">{summary}</div>}
    </div>
  );
}

export default AISummary;
