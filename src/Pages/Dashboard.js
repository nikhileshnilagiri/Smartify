import React, { useState } from "react";
import { Tabs, Tab, Box, IconButton } from '@mui/material';
import { Notifications } from '@mui/icons-material';
import Light from "../Components/Light";
import Fan from "../Components/Fan";
import AC from "../Components/AC";
import { useUser } from "../Context/UserContext";

function Dashboard() {
  const [value, setValue] = useState(0);
  const { user } = useUser();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (

    <div className="container mt-4">
      <section>
        <div className="d-flex justify-content-between mb-3">
          <div>
            <h2>Hello, {user.username}!</h2>
            <p>Welcome back to your home</p>
          </div>
          <IconButton size="medium" sx={{ borderRadius: "500px" }}>
            <Notifications />
          </IconButton>
        </div></section>

      <section><div>
        <div className="row mt-4">
          <div className="col-12 col-md-6 mb-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">
                <h5 className="card-title">Temperature</h5>
                <h2 className="card-text">22°C</h2>
                <p className="card-text">Normal range</p>
              </div>
            </div>
          </div>

          <div className="col-12 col-md-6 mb-3">
            <div className="card border-0 shadow h-100">
              <div className="card-body">
                <h5 className="card-title">Humidity</h5>
                <h2 className="card-text">45%</h2>
                <p className="card-text">Optimal level</p>
              </div>
            </div>
          </div>
        </div>
      </div></section>

      <section>
        <div className="row">
          <div className="col-12 mb-3">
            <div className="card border-0 shadow">
              <div className="card-body">
                <div className="d-flex justify-content-between">
                  <h5 className="card-title">Your Rooms</h5>
                  <div className="h-25">
                  </div>
                </div>
                <div className="mt-3">
                  <div className="d-flex justify-content-between">
                    <Box sx={{ maxWidth: { xs: 320, sm: 287 }, bgcolor: 'background.paper', p: 0 }}>
                      <Tabs
                        value={value}
                        onChange={handleChange}
                        variant="scrollable"
                        scrollButtons={false}
                        aria-label="scrollable auto tabs example"
                        sx={{ minHeight: "28px", p: 0 }}
                        style={{ backgroundColor: "#EEEDEB" }}
                      >
                        <Tab label="All devices" sx={{ minHeight: "28px", textTransform: 'none', fontSize: "15px", p: 1 }} />
                        {user.rooms.map((room) => {
                          return <Tab label={room.roomname} sx={{ minHeight: "28px", textTransform: 'none', fontSize: "15px", p: 1 }} />
                        })}

                      </Tabs>
                    </Box>
                  </div>
                  <div className="row mt-4">
                    {user.devices.map((device) => {
                      if (device.devicetype === "Light") {
                        return <Light name={device.devicename} />
                      } else if (device.devicetype === "Fan") {
                        return <Fan name={device.devicename} />
                      } else if (device.devicetype === "Air Conditioner") {
                        return <AC name={device.devicename} />
                      }
                      return (
                      <div className="d-flex justify-content-center align-items-center" >
                        <h4>No devices found</h4>
                      </div>);
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="row">
          <div className="col-12 mb-3">
            <div className="card border-0 shadow">
              <div className="card-body">
                <h5>Quick Actions</h5>
                <div className="d-flex justify-content-between mt-3">
                  <button className="btn btn-dark w-25 d-flex align-items-center justify-content-center me-2" style={{ height: '80px' }}>
                    All Off
                  </button>
                  <button className="btn btn-dark w-25 d-flex align-items-center justify-content-center me-2" style={{ height: '80px' }}>
                    Lights Off
                  </button>
                  <button className="btn btn-dark w-25 d-flex align-items-center justify-content-center me-2" style={{ height: '80px' }}>
                    Lock All
                  </button>
                  <button className="btn btn-dark w-25 d-flex align-items-center justify-content-center" style={{ height: '80px' }}>
                    Unlock All
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>

  );
}

export default Dashboard;
