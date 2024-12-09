import React, { useState } from 'react';
import { Button, TextField, Checkbox, FormControlLabel, Typography} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../Context/UserContext';
import { toast, Slide, ToastContainer } from 'react-toastify';
import Cookies from 'js-cookie';
import ForgotPassword from './forgotpassword';

function Login() {
  const [data, setData] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSignUp = () => navigate('/signup');
  const handleForgotPasswordOpen = () => setIsForgotPasswordOpen(true);
  const handleForgotPasswordClose = () => setIsForgotPasswordOpen(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}/api/user/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const { authtoken, user } = await response.json();
        Cookies.set('authToken', authtoken, { expires: 7 });
        Cookies.set('user', JSON.stringify(user), { expires: 7 });
        setUser(user);
        navigate("/dashboard");
      } else {
        toast.error('Invalid Credentials!', {
          position: "top-center",
          autoClose: 3000,
          theme: "colored",
          transition: Slide,
        });
      }
    } catch (error) {
      console.error(error);
    }
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
                variant="outlined"
                type="email"
                fullWidth
                margin="normal"
                placeholder="Enter your email"
                onChange={(e) => setData(prevData => ({ ...prevData, email: e.target.value }))}
              />

              <TextField
                label="Password"
                variant="outlined"
                type="password"
                fullWidth
                margin="normal"
                placeholder="Enter your password"
                onChange={(e) => setData(prevData => ({ ...prevData, password: e.target.value }))}
              />

              <div className="d-flex justify-content-between align-items-center mb-4">
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Remember me"
                />
                <Typography
                  style={{ cursor: "pointer", color: "blue" }}
                  onClick={handleForgotPasswordOpen}
                >
                  Forgot password?
                </Typography>
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

              <hr />
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

      {/* Forgot Password Dialog */}
      <ForgotPassword open={isForgotPasswordOpen} onClose={handleForgotPasswordClose} />
    </section>
  );
}

export default Login;
