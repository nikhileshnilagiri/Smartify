import React, { useState } from "react";
import { TextField, Button, Typography, Dialog, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

function ForgotPassword({ open, onClose }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [step, setStep] = useState(1); // Step 1: Forgot Password, Step 2: Reset Password

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
        console.log("handle",email);
      const response = await axios.post("http://localhost:8080/api/user/forgot-password", { email });
      setMessage(response.data.message);
      setStep(2); // Move to OTP input step
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending OTP");
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/api/user/reset-password", { email, otp, newPassword });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{step === 1 ? "Forgot Password" : "Reset Password"}</DialogTitle>
      <DialogContent>
        {step === 1 ? (
          <form onSubmit={handleForgotPassword} style={{ textAlign: "center" }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Send OTP
            </Button>
            {message && <Typography variant="body2" color="error" style={{ marginTop: "10px" }}>{message}</Typography>}
          </form>
        ) : (
          <form onSubmit={handleResetPassword} style={{ textAlign: "center" }}>
            <TextField
              label="OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Reset Password
            </Button>
            {message && <Typography variant="body2" color="error" style={{ marginTop: "10px" }}>{message}</Typography>}
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default ForgotPassword;
