import React from "react";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EmailIcon from '@mui/icons-material/Email';
import { TextField, MenuItem, Select, InputLabel, FormControl, Button } from '@mui/material';
import { useUser } from "../Context/UserContext";

function Settings() {
  const { user } = useUser();

  return (
    <div>
      <div className="container mt-4">
        <div className="row">
          <div className="col-12 mb-3">
            <div className="card border-0 shadow">
              <div className="card-body">
                <h5 className="card-title mb-3" style={{ fontSize: '1.5rem' }}>User Information</h5>
                <div className="mb-3" style={{ fontSize: '1.2rem' }}>
                  <AccountCircleIcon /> <strong>Username:</strong> {user.username}
                </div>
                <div className="mb-3" style={{ fontSize: '1.2rem' }}>
                  <EmailIcon /> <strong>Email:</strong> {user.email}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow">
              <div className="card-body">
                <h5 className="card-title mb-4">Change Password</h5>
                <form>
                  <div className="mb-3">
                    <TextField
                      label="Current Password"
                      type="password"
                      fullWidth
                      required
                      variant="outlined"
                      id="currentPassword"
                    />
                  </div>
                  <div className="mb-3">
                    <TextField
                      label="New Password"
                      type="password"
                      fullWidth
                      required
                      variant="outlined"
                      id="newPassword"
                    />
                  </div>
                  <div className="mb-3">
                    <TextField
                      label="Confirm New Password"
                      type="password"
                      fullWidth
                      required
                      variant="outlined"
                      id="confirmPassword"
                    />
                  </div>
                  <Button type="submit" variant="contained" style={{backgroundColor:"black"}}>
                    Update Password
                  </Button>
                </form>
              </div>
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <div className="card border-0 shadow">
              <div className="card-body">
                <h5 className="card-title mb-4">Account Settings</h5>
                <form>
                  <div className="mb-3">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="notification-label">Notifications</InputLabel>
                      <Select
                        labelId="notification-label"
                        id="notification"
                        label="Notifications"
                      >
                        <MenuItem value="enabled">Enabled</MenuItem>
                        <MenuItem value="disabled">Disabled</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <div className="mb-3">
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="theme-label">Theme</InputLabel>
                      <Select
                        labelId="theme-label"
                        id="theme"
                        label="Theme"
                      >
                        <MenuItem value="light">Light</MenuItem>
                        <MenuItem value="dark">Dark</MenuItem>
                      </Select>
                    </FormControl>
                  </div>
                  <Button type="submit" variant="contained" style={{backgroundColor:"black"}}>
                    Save Changes
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
