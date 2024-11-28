import React, { useState } from 'react';
import { Button, TextField, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { toast,Slide,ToastContainer } from 'react-toastify';


function Login() {

  const [data, setdata] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { setUser } = useUser();

  const handleSignUp = () => navigate('/signup');
  
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
      if (response.ok) {
        const userdata = await response.json();
        setUser(userdata);
        navigate("/dashboard");
      } else {
        toast.error('Invalid Credentials!', {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Slide
        });
        
      }
    } catch (error) {
      console.log(error);
    }
  }

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
                variant="outlined"
                type="email"
                fullWidth
                margin="normal"
                placeholder="Enter your email"
                onChange={(e) => setdata((prevdata) => ({ ...prevdata, email: e.target.value }))}
              />

              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                placeholder="Enter your password"
                onChange={(e) => setdata((prevdata) => ({ ...prevdata, password: e.target.value }))}
              />


              <div className="d-flex justify-content-between align-items-center mb-4">
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Remember me"
                />
                  Forgot password?
              </div>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                className="mb-3"
              >
                Login
              </Button>

              <hr/>
            </form>
            <Typography variant="body2" align="center" color="black" className="mt-3">
              Don't have an account?{' '}
              <span style={{ color: "blue", cursor: "pointer" }} onClick={handleSignUp}>
                Sign Up
              </span>
            </Typography>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;