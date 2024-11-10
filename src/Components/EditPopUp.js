import React, { useState, useEffect } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useUser } from "../Context/UserContext";

function UpdateDevicePopUp(props) {
    const { user, updateDevice } = useUser();  // Assuming `updateDevice` is a function from context to update the user state

    // The state will hold the current device data that is being edited
    const [deviceData, setDeviceData] = useState({
        deviceid: "",
        devicename: "",
        location: "",
        devicetype: "Light",
        status: false,
    });

    // When the popup is opened, set the device data
    useEffect(() => {
        if (props.device) {
            setDeviceData({
                deviceid: props.device.deviceid,
                devicename: props.device.devicename,
                location: props.device.location,
                devicetype: props.device.devicetype,
                status: props.device.status,
            });
        }
    }, [props.device]);

    // Handle saving the updated device info
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/updatedevice', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: user.email,
                    deviceid: deviceData.deviceid,
                    updatedData: deviceData,
                }),
            });
            if (response.ok) {
                // Update the device in the context state
                updateDevice(deviceData);
            }
        } catch (error) {
            console.error("Error updating device:", error);
        }
    };

    const handleCancel = () => {
        props.onClose();
    };

    return (
        <Dialog open={props.value} maxWidth="sm" fullWidth>
            <DialogTitle>Update Device</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSave}>
                    <div className="mb-3">
                        <label htmlFor="deviceName" className="form-label">
                            Device Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Device Name"
                            value={deviceData.devicename}
                            onChange={(e) => setDeviceData({ ...deviceData, devicename: e.target.value })}
                        />
                    </div>

                    <div className="mb-3">
                        <label htmlFor="selectRoom" className="form-label">
                            Select Room
                        </label>
                        <select
                            id="selectRoom"
                            className="form-select"
                            value={deviceData.location}
                            onChange={(e) => setDeviceData({ ...deviceData, location: e.target.value })}
                        >
                            <option value="">Choose a room...</option>
                            {user.rooms.map((room) => (
                                <option key={room.name} value={room.name}>
                                    {room.name}
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
                            value={deviceData.devicetype}
                            onChange={(e) => setDeviceData({ ...deviceData, devicetype: e.target.value })}
                        >
                            <option value="Light">Light</option>
                            <option value="Air Conditioner">Air Conditioner</option>
                            <option value="Fan">Fan</option>
                        </select>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="deviceStatus" className="form-label">
                            Device Status
                        </label>
                        <select
                            id="deviceStatus"
                            className="form-select"
                            value={deviceData.status ? "On" : "Off"}
                            onChange={(e) => setDeviceData({ ...deviceData, status: e.target.value === "On" })}
                        >
                            <option value="On">On</option>
                            <option value="Off">Off</option>
                        </select>
                    </div>
                </form>
            </DialogContent>

            <DialogActions>
                <Button onClick={handleSave} color="primary">
                    Save Changes
                </Button>
                <Button onClick={handleCancel} color="secondary">
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default UpdateDevicePopUp;
