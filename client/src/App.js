import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';
import Upload from "./pages/upload";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Register />} />           {/* default route */}
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/upload" element={<Upload />} />

      </Routes>
    </Router>
  );
}

export default App;
