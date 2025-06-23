import React from "react";
import Sidebar from "../components/Sidebar";
import HistoryList from "../components/HistoryList";

const History = () => (
  <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
    <Sidebar />
    <main className="flex-1 p-8">
      <HistoryList />
    </main>
  </div>
);

export default History;
