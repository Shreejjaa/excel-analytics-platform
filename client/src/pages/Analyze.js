import React, { useEffect, useState, useRef } from "react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  ResponsiveContainer,
  Label,
  ScatterChart,
  Scatter,
  CartesianGrid
} from "recharts";
import ChartSelector from "../components/ChartSelector";
import ThreeDBarChart from "../components/ThreeDBarChart";
import Layout from "../components/Layout";
import Spinner from "../components/Spinner";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import ThreeDScatterChart from "../components/ThreeDScatterChart";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1", "#a4de6c"];

const Analyze = () => {
  const [uploads, setUploads] = useState([]);
  const [selectedChart, setSelectedChart] = useState("pie");
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [fields, setFields] = useState([]);
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [loading, setLoading] = useState(true);

  const chartRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLoading(true);
    fetch("http://localhost:5000/api/excel/myuploads", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const uploads = data.uploads || [];
        setUploads(uploads);
        if (uploads.length > 0) {
          const sample = uploads[0].data;
          if (sample.length > 0) {
            const keys = Object.keys(sample[0]);
            setFields(keys);
            setXAxis(keys[0]);
            setYAxis(keys[1]);
            formatChartData(sample, keys[0], keys[1]);
          }
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const formatChartData = (fileData, xField, yField) => {
    if (!fileData || fileData.length === 0) return;
    const formatted = fileData
      .map((row) => ({
        name: row[xField],
        value: parseFloat(row[yField]) || 0,
        x: parseFloat(row[xField]) || 0,
        y: parseFloat(row[yField]) || 0,
      }))
      .slice(0, 10);
    setChartData(formatted);
  };

  const handleFileChange = (e) => {
    const index = parseInt(e.target.value);
    setSelectedFileIndex(index);
    const selected = uploads[index];
    const keys = Object.keys(selected.data[0]);
    setFields(keys);
    setXAxis(keys[0]);
    setYAxis(keys[1]);
    formatChartData(selected.data, keys[0], keys[1]);
  };

  const renderChart = () => {
    switch (selectedChart) {
      case "bar":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Bar Chart: {xAxis} vs {yAxis}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <XAxis dataKey="name">
                  <Label value={xAxis} offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis>
                  <Label value={yAxis} angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      case "line":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Line Chart: {xAxis} vs {yAxis}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <XAxis dataKey="name">
                  <Label value={xAxis} offset={-5} position="insideBottom" />
                </XAxis>
                <YAxis>
                  <Label value={yAxis} angle={-90} position="insideLeft" />
                </YAxis>
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        );
      case "3d-bar":
        return <ThreeDBarChart data={chartData} xAxis={xAxis} yAxis={yAxis} />;
      case "scatter":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">Scatter Chart: {xAxis} vs {yAxis}</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid />
                <XAxis dataKey="x" name={xAxis} />
                <YAxis dataKey="y" name={yAxis} />
                <Tooltip />
                <Scatter data={chartData} fill="#8884d8" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        );
      case "3d-scatter":
        return (
          <div>
            <h3 className="text-lg font-semibold mb-2">3D Scatter Chart: {xAxis} vs {yAxis} vs Z</h3>
            <ThreeDScatterChart
              data={chartData.map(d => ({
                x: d.x || 0,
                y: d.y || 0,
                z: d.z || Math.random() * 50 // Use actual z if available, or random for demo
              }))}
              width={600}
              height={400}
            />
          </div>
        );
      case "pie":
      default:
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
    }
  };

  useEffect(() => {
    if (uploads.length > 0 && fields.length > 0) {
      formatChartData(uploads[selectedFileIndex].data, xAxis, yAxis);
    }
    // eslint-disable-next-line
  }, [uploads, fields.length, selectedFileIndex, xAxis, yAxis]);

  const chartTypes = [
    { type: "pie", label: "Pie Chart" },
    { type: "bar", label: "Bar Chart" },
    { type: "line", label: "Line Chart" },
    { type: "3d-bar", label: "3D Bar Chart" },
    { type: "scatter", label: "Scatter Chart" },
    { type: "3d-scatter", label: "3D Scatter Chart" },
  ];

  const saveAnalysis = async () => {
    const token = localStorage.getItem("token");
    const fileId = uploads[selectedFileIndex]._id;
    await fetch("http://localhost:5000/api/excel/save-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fileId,
        chartType: selectedChart,
        xAxis,
        yAxis,
      }),
    });
  };

  // Download as PNG
  const handleDownloadPNG = () => {
    if (chartRef.current) {
      toPng(chartRef.current)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "chart.png";
          link.href = dataUrl;
          link.click();
        });
    }
  };

  // Download as PDF
  const handleDownloadPDF = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 180, 100);
        pdf.save("chart.pdf");
      });
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold mb-4">📊 Analyze Uploaded Excel Data</h2>
      {loading ? (
        <Spinner />
      ) : uploads.length > 0 ? (
        <>
          <div className="mb-4">
            <label className="block font-medium mb-1 text-gray-700">Select File:</label>
            <select
              className="border rounded px-3 py-2 w-full md:w-1/2"
              value={selectedFileIndex}
              onChange={handleFileChange}
            >
              {uploads.map((file, index) => (
                <option key={index} value={index}>
                  {file.fileName}
                </option>
              ))}
            </select>
          </div>

          <ChartSelector
            fields={fields}
            xAxis={xAxis}
            yAxis={yAxis}
            setXAxis={setXAxis}
            setYAxis={setYAxis}
          />

          <div className="mb-4 flex gap-3">
            {chartTypes.map(({ type, label }) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-full text-white ${selectedChart === type ? "bg-blue-600" : "bg-blue-400 hover:bg-blue-500"}`}
                onClick={() => {
                  setSelectedChart(type);
                  saveAnalysis();
                }}
                title={label}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Chart and download buttons */}
          <div ref={chartRef}>
            {chartData.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No data available for this chart.</div>
            ) : (
              renderChart()
            )}
          </div>
          <div className="flex gap-4 mt-4">
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              onClick={handleDownloadPNG}
            >
              Download Chart as PNG
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={handleDownloadPDF}
            >
              Download Chart as PDF
            </button>
          </div>

          {/* Legend and data table */}
          <div className="flex flex-col md:flex-row justify-between items-center mt-4 gap-4">
            <div>
              <span className="inline-block w-4 h-4 rounded mr-2" style={{ background: "#4f8a8b" }}></span>
              <span>Bar Value</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-max text-sm">
                <thead>
                  <tr>
                    <th className="px-2 py-1 border">{xAxis}</th>
                    <th className="px-2 py-1 border">{yAxis}</th>
                  </tr>
                </thead>
                <tbody>
                  {chartData.map((item, i) => (
                    <tr key={i}>
                      <td className="px-2 py-1 border">{item.name}</td>
                      <td className="px-2 py-1 border">{item.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <p>No uploads found. Please upload a file first.</p>
      )}
    </Layout>
  );
};

export default Analyze;