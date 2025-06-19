import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Spinner from "./components/Spinner";
import Settings from "./pages/Settings/Settings";
import Admin from "./pages/Admin";

// Lazy load your pages/components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Upload = lazy(() => import("./pages/upload"));
const Analyze = lazy(() => import("./pages/Analyze"));
const HistoryList = lazy(() => import("./components/HistoryList"));
const Register = lazy(() => import("./pages/register"));
const Login = lazy(() => import("./pages/login"));
// Add Settings if you have it
// const Settings = lazy(() => import("./pages/Settings"));

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route
            path="/"
            element={
              localStorage.getItem("token")
                ? <Navigate to="/dashboard" />
                : <Navigate to="/login" />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/analyze/:id" element={<Analyze />} />
          <Route path="/history" element={<HistoryList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;