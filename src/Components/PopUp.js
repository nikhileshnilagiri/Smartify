import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, CircularProgress } from "@mui/material";
import { useUser } from "../Context/UserContext";

function PopUp(props) {
    const { user, addDevice } = useUser();
    const [activeStep, setActiveStep] = useState("Start");
    const [Dname, setDname] = useState("");
    const [Dtype, setDtype] = useState("Light");
    const [RoomName, setRoomName] = useState("");
    const [selectedRoom, setSelectedRoom] = useState("");
    const [existingRooms, setExistingRooms] = useState([]);
    const [availableDevices, setAvailableDevices] = useState([]); // List of available devices
    const [selectedDevice, setSelectedDevice] = useState(""); // To track selected device
    const [isScanning, setIsScanning] = useState(false); // To handle scanning state

    // Simulate fetching available devices (you can replace this with an actual API call)
    useEffect(() => {
        if (activeStep === "Device") {
            // Start scanning for devices
            setIsScanning(true);
            setAvailableDevices([]); // Clear the previous list
            
            // Simulate a delay to mimic scanning devices
            const timer = setTimeout(() => {
                // Simulate fetched devices
                setAvailableDevices([
                    { id: "device-1", name: "Device 1" },
                    { id: "device-2", name: "Device 2" },
                    { id: "device-3", name: "Device 3" },
                ]);
                setIsScanning(false); // Stop scanning after devices are "found"
            }, 3000); // Simulate 3 seconds delay for scanning

            // Cleanup timer if the component unmounts
            return () => clearTimeout(timer);
        }
    }, [activeStep]);

    const handleBack = () => {
        setActiveStep("Start");
    };

    const handleSave = async () => {
        if (activeStep === "Room") {
            const data = RoomName;
            try {
                const response = await fetch("http://localhost:5000/setuproom", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user.email, name: data }),
                });

                if (response.ok) {
                    setExistingRooms([...existingRooms, RoomName]);
                    setRoomName("");
                    setActiveStep("Start");
                }
            } catch (error) {
                console.error("Error setting up room:", error);
            }
        } else if (activeStep === "Device") {
            const data = { devicename: Dname, location: selectedRoom, devicetype: Dtype, deviceid: selectedDevice };
            try {
                const response = await fetch("http://localhost:5000/device", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: user.email, devicedata: data }),
                });

                if (response.ok) {
                    addDevice(data);
                    setDname("");
                    setSelectedRoom("");
                    setSelectedDevice("");
                    setActiveStep("Start");
                }
            } catch (error) {
                console.error("Error adding device:", error);
            }
        }
    };

    const handleCancel = () => {
        props.onCancel();
    };

    const renderRoomSetup = () => (
        <div className="mb-3">
            <label htmlFor="roomName" className="form-label">
                Room Name
            </label>
            <input
                type="text"
                className="form-control"
                placeholder="Room Name"
                value={RoomName}
                onChange={(e) => setRoomName(e.target.value)}
            />
        </div>
    );

    const renderDeviceSetup = () => (
        <div>
            <div className="mb-3">
                <label htmlFor="deviceName" className="form-label">
                    Device Name
                </label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Device Name"
                    value={Dname}
                    onChange={(e) => setDname(e.target.value)}
                />
            </div>
            <div className="mb-3">
                <label htmlFor="selectRoom" className="form-label">
                    Select Room
                </label>
                <select
                    id="selectRoom"
                    className="form-select"
                    value={selectedRoom}
                    onChange={(e) => setSelectedRoom(e.target.value)}
                >
                    <option value="">Choose a room...</option>
                    {user.rooms.map((room) => (
                        <option key={room.roomname} value={room.roomname}>
                            {room.roomname}
                        </option>
                    ))}
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="selectDeviceType" className="form-label">
                    Device Type
                </label>
                <select
                    id="selectDeviceType"
                    className="form-select"
                    value={Dtype}
                    onChange={(e) => setDtype(e.target.value)}
                >
                    <option value="Light">Light</option>
                    <option value="Air Conditioner">Air Conditioner</option>
                    <option value="Fan">Fan</option>
                </select>
            </div>

            {/* Display Available Devices */}
            <div className="mb-3">
                <label htmlFor="availableDevices" className="form-label">
                    Available Devices
                </label>

                {/* Show loading spinner if scanning */}
                {isScanning ? (
                    <div className="d-flex justify-content-center">
                        <CircularProgress />
                    </div>
                ) : (
                    <ul className="list-group">
                        {availableDevices.length === 0 ? (
                            <li className="list-group-item">No devices found</li>
                        ) : (
                            availableDevices.map((device) => (
                                <li
                                    key={device.id}
                                    className={`list-group-item ${selectedDevice === device.id ? "active" : ""}`}
                                    onClick={() => setSelectedDevice(device.id)} // Select device on click
                                >
                                    {device.name}
                                </li>
                            ))
                        )}
                    </ul>
                )}
            </div>
        </div>
    );

    const getDialogTitle = () => {
        if (activeStep === "Start") return "Choose Option";
        if (activeStep === "Room") return "Setup Room";
        if (activeStep === "Device") return "Setup Device";
    };

    return (
        <Dialog open={props.value} maxWidth="sm" fullWidth>
            <DialogTitle>{getDialogTitle()}</DialogTitle>
            <DialogContent>
                {activeStep === "Start" && (
                    <div>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={() => setActiveStep("Room")}
                        >
                            Create New Room
                        </Button>
                        <Button
                            fullWidth
                            variant="contained"
                            color="secondary"
                            onClick={() => setActiveStep("Device")}
                            style={{ marginTop: "8px" }}
                        >
                            Setup New Device
                        </Button>
                    </div>
                )}
                {activeStep === "Room" && renderRoomSetup()}
                {activeStep === "Device" && renderDeviceSetup()}
            </DialogContent>

            <DialogActions>
                {activeStep !== "Start" && (
                    <Button onClick={handleBack} color="secondary">
                        Back
                    </Button>
                )}
                {activeStep === "Room" && (
                    <Button
                        onClick={handleSave}
                        color="primary"
                        disabled={!RoomName}
                    >
                        Save Room
                    </Button>
                )}
                {activeStep === "Device" && (
                    <Button
                        onClick={handleSave}
                        color="primary"
                        disabled={!Dname || !Dtype || !selectedRoom || !selectedDevice}
                    >
                        Save Device
                    </Button>
                )}
                <Button onClick={handleCancel} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default PopUp;
