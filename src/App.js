import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import ForgotPassword from "./Pages/forgotpassword";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import Devices from "./Pages/Devices";
import Settings from "./Pages/Settings";
import Users from "./Pages/Users"
import { UserProvider } from "./Context/UserContext";
import { WebSocketProvider } from './Context/WebSocketContext';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get('authToken');
  return token ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <UserProvider>
      <WebSocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgotpassword" element={<ForgotPassword />} />
           
            <Route path="*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                  <Route path="/devices" element={<ProtectedRoute><Devices /></ProtectedRoute>} />
                  <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                </Routes>
              </>
            } />
          </Routes>
        </Router>
      </WebSocketProvider>
    </UserProvider>
  );
}

export default App;
