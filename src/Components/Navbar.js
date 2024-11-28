import React, { useState } from 'react';
import { Devices, Dashboard } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { Menu, MenuItem, Avatar, ListItemIcon, Divider, IconButton } from '@mui/material';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';

function NavBar() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDashboard = () => navigate("/dashboard");
  const handleDevices = () => navigate("/devices");
  const handleSettings = () => navigate("/settings");
  const handleLogout = () => navigate("/");

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary text-white px-4 py-2 shadow-sm fixed-top">
      <div className='d-flex gap-2 p-0'>
      <img
          src={require("../Assets/smarthome.png")}
          alt="Weather Icon"
          className="mb-1"
          style={{width:"30px",height:"30px"}}
          
      />
      <h3 style={{ color: "black" }}>Smartify</h3></div>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ms-auto" style={{ cursor: "pointer" }}>
          <li className="nav-item me-3">
            <span className="nav-link fs-6" onClick={handleDashboard}>
              <Dashboard fontSize="small" /> Dashboard
            </span>
          </li>
          <li className="nav-item me-3" onClick={handleDevices}>
            <span className="nav-link fs-6">
              <Devices fontSize="small" /> Devices
            </span>
          </li>
          <li className="nav-item">
            <IconButton
              onClick={handleClick}
              size="small"
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 30, height: 30 }}>
              </Avatar>
            </IconButton>
          </li>
        </ul>
      </div>

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              '& .MuiAvatar-root': {
                width: 32,
                height: 32,
              },
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Divider/>
        <MenuItem onClick={handleSettings}>
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </nav>
  );
}

export default NavBar;
