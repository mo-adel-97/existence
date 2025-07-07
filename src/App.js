// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import AttendancePage from './pages/AttendancePage';
import LoginPage from './pages/login';
import "./App.css"
import DailyAttendanceReport from "./pages/DailyAttendanceReport";

// Private Route Component
const PrivateRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  
  // Check if user exists and has required data
  if (user && user.userName) {
    return children;
  }
  
  // Redirect to dashboard/login if not authenticated
  return <Navigate to="/" replace />;
};

function App() {
  return (
    <div>
      <Router>
        <Routes>
          {/* DashboardPage serves as both dashboard and login */}
          <Route path="/" element={<LoginPage />} />
          
          {/* Protected Attendance Page */}
          <Route 
            path="/attendance" 
            element={
              <PrivateRoute>
                <AttendancePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/daily" 
            element={
              <PrivateRoute>
                <DailyAttendanceReport />
              </PrivateRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;