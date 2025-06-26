import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Spinner from "./components/Spinner";
import Settings from "./pages/Settings/Settings";
import Admin from "./pages/Admin";
<<<<<<< HEAD
import History from "./pages/History";
=======
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35

// Lazy load your pages/components
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Upload = lazy(() => import("./pages/upload"));
const Analyze = lazy(() => import("./pages/Analyze"));
<<<<<<< HEAD
// const HistoryList = lazy(() => import("./components/HistoryList"));
const Register = lazy(() => import("./pages/register"));
const Login = lazy(() => import("./pages/login"));
const Notifications = lazy(() => import("./pages/Notifications"));
=======
const HistoryList = lazy(() => import("./components/HistoryList"));
const Register = lazy(() => import("./pages/register"));
const Login = lazy(() => import("./pages/login"));
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
// Add Settings if you have it
// const Settings = lazy(() => import("./pages/Settings"));

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

<<<<<<< HEAD
// Auth Success Component for Google OAuth
const AuthSuccess = () => {
  return <Navigate to="/dashboard" />;
};

=======
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
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
<<<<<<< HEAD
          <Route path="/auth-success" element={<AuthSuccess />} />
=======
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/analyze/:id" element={<Analyze />} />
<<<<<<< HEAD
          <Route path="/history" element={<History />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
=======
          <Route path="/history" element={<HistoryList />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/admin" element={<Admin />} />
>>>>>>> 1f2f85abdac57e98016bbc1d4484a2b64a3b6e35
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;