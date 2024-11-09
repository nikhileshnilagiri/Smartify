import { useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Tabs, Tab, Box } from '@mui/material';

import PopUp from "../Components/PopUp";
import { useUser } from "../Context/UserContext";
import Device from "../Components/Device";

export default function DeviceManager() {
  const { user } = useUser();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  function handleAddDevice() {
    setOpen(!open)
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <main className="container mt-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Device Management</h2>

        <div className="card mb-4 shadow border-0">
          <div className="card-body">
            <h5>Manage Devices</h5>
            <p className="text-muted">View and manage all connected devices in your home.</p>
          </div>
          <div className="card-body ">
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
              </Box></div>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <input
                type="text"
                className="form-control w-50"
                placeholder="Search devices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderRadius: "50px" }}
              />
              <button className="btn btn-primary" onClick={handleAddDevice}>
                <AddCircleOutlineIcon className="mr-2" fontSize="small" />
                Add Device
              </button>
            </div>

            <div className="row">
              {user.devices
                .filter(device => device.devicename.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((device) => (
                  <div key={device.devicename} className="col-12 col-sm-6 col-md-3 col-lg-3 mb-4">
                    <Device
                      name={device.devicename}
                      location={device.location}
                      type={device.devicetype}
                      status={device.status}
                      battery={device.battery}
                    />
                  </div>
                ))}
            </div>
          </div>
        </div>

        <PopUp value={open} onCancel={() => setOpen(false)} />
      </div>
    </main>
  );
}
