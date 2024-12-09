import React, { useState } from "react";
import { Button, TextField, Checkbox, FormControlLabel, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/UserContext";
import { toast, Slide, ToastContainer } from "react-toastify";
import Cookies from "js-cookie";
import GuestIDPopup from "../Components/GuestIDPopup";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [showGuestIDPopup, setShowGuestIDPopup] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSignUp = () => navigate("/signup");

  const handleLogin = async (e) => {
    e.preventDefault();
    console.log("Login.js: Attempting admin login...");
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { authtoken, user } = await response.json();
        Cookies.set("authToken", authtoken, { expires: 7 });
        Cookies.set("user", JSON.stringify(user), { expires: 7 });
        setUser(user);
        console.log(user);
        console.log("Login.js: Admin login successful. Navigating to dashboard.");
        // Pass adminEmail as state to the next page
        navigate("/dashboard", { state: { adminEmail: user.email } });
      } else {
        toast.error("Invalid Credentials!", {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Slide,
        });
      }
    } catch (error) {
      console.error("Login.js: Error during admin login:", error);
    }
  };

  const handleGuestLogin = () => {
    console.log("Login.js: Guest login button clicked.");
    Cookies.remove("authToken"); // Remove admin token if present
    setShowGuestIDPopup(true);
  };

  const handleGuestIDVerify = (guestData) => {
    console.log("Login.js: Guest ID verified. Data:", guestData);
    navigate("/dashboard");
  };

  return (
    <section className="vh-100">
      <ToastContainer />
      <div className="container py-5 h-100">
        <div className="row d-flex align-items-center justify-content-center h-100">
          <div className="col-md-8 col-lg-7 col-xl-6">
            <img
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
              className="img-fluid"
              alt="Phone"
            />
          </div>
          <div className="col-md-6 col-lg-4 col-xl-4">
            <Typography variant="h4" align="center" gutterBottom>
              Login to Your Account
            </Typography>
            <form onSubmit={handleLogin}>
              <TextField
                label="Email Address"
                name="email"
                variant="outlined"
                type="email"
                fullWidth
                margin="normal"
                placeholder="Enter your email"
                onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
              />
              <TextField
                label="Password"
                name="password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                placeholder="Enter your password"
                onChange={(e) => setData((prev) => ({ ...prev, password: e.target.value }))}
              />
              <div className="d-flex justify-content-between align-items-center mb-4">
                <FormControlLabel control={<Checkbox defaultChecked />} label="Remember me" />
                Forgot password?
              </div>
              <Button type="submit" variant="contained" color="primary" fullWidth size="large" className="mb-3">
                Login
              </Button>
              <hr />
            </form>
            <Button
              variant="outlined"
              color="primary"
              fullWidth
              size="large"
              className="mb-3"
              onClick={handleGuestLogin}>
              Continue as Guest
            </Button>
            <Typography variant="body2" align="center" color="black" className="mt-3">
              Don't have an account?{" "}
              <span style={{ color: "blue", cursor: "pointer" }} onClick={handleSignUp}>
                Sign Up
              </span>
            </Typography>
          </div>
        </div>
      </div>

      {showGuestIDPopup && (
        <GuestIDPopup onClose={() => setShowGuestIDPopup(false)} onVerify={handleGuestIDVerify} />
      )}
    </section>
  );
}

export default Login;
