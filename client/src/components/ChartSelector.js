import React, { useEffect } from 'react';
import axios from "axios";

const ChartSelector = ({ fields, xAxis, yAxis, setXAxis, setYAxis }) => {
  // const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get('/api/excel/data', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      // setData(res.data);
    });
  }, []);

  return (
    <div className="mb-4 flex gap-4">
      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">X-Axis</label>
        <select
          className="border px-3 py-2 rounded"
          value={xAxis}
          onChange={(e) => setXAxis(e.target.value)}
        >
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label className="text-sm text-gray-600 mb-1">Y-Axis</label>
        <select
          className="border px-3 py-2 rounded"
          value={yAxis}
          onChange={(e) => setYAxis(e.target.value)}
        >
          {fields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default ChartSelector;
