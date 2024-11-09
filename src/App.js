import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/SignUp";
import Navbar from "./Components/Navbar";
import Dashboard from "./Pages/Dashboard";
import Devices from "./Pages/Devices";
import { UserProvider } from "./Context/UserContext";
import { SocketProvider } from "./Context/SocketContext";


function App() {
  return (
    <UserProvider>
      <SocketProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={
              <><Navbar />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/devices" element={<Devices />} />
                </Routes></>
            } />
          </Routes>
        </Router></SocketProvider></UserProvider>
  )
}
export default App;