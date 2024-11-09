import React, { useState } from "react";
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { useUser } from "../Context/UserContext";
import { useSocket } from '../Context/SocketContext';

function PopUp(props) {
    const { user, addDevice } = useUser();
    const {socket} = useSocket();

    const [activeStep, setActiveStep] = useState("Start");
    const [room,setroom] = useState({email:user.email , name:""});
    const [devicedata,setdevicedata] = useState({email:user.email ,devicename:"",location:"",devicetype:"Light",status:false});

    const handleSave = (e) =>{
        e.preventDefault();
        if(activeStep==="Room"){
            if(socket){
                socket.emit('addroom',room,(res)=>{
                    if(res.status===200){alert('Successful')}
                });
            }
        }else if(activeStep==="Device"){
            if(socket){
                socket.emit('newdevice',devicedata,(res)=>{
                    if(res.status===200){addDevice(devicedata)}
                })
            }
        }
    }


    const handleBack = () => {
        setActiveStep("Start");
    };

    const handleCancel = () => {
        props.onCancel();
    };

    const renderRoomSetup = () => (
        <form onSubmit={handleSave}>
        <div className="mb-3">
            <label htmlFor="roomName" className="form-label">
                Room Name
            </label>
            <input
                type="text"
                className="form-control"
                placeholder="Room Name"
                value={RoomName}
                onChange={(e) => setroom((prev)=>({...prev,name:e.target.value}))}
            />
        </div>
        </form>
    );

    const renderDeviceSetup = () => (
        <div>
            <form onSubmit={handleSave}>
            <div className="mb-3">
                <label htmlFor="deviceName" className="form-label">
                    Device Name
                </label>
                <input
                    type="text"
                    className="form-control"
                    placeholder="Device Name"
                    value={Dname}
                    onChange={(e) => setdevicedata((prev)=>({...prev,devicename:e.target.value}))}
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
                    onChange={(e) => setdevicedata((prev)=>({...prev,location:e.target.value}))}
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
                    onChange={(e) => setdevicedata((prev)=>({...prev,devicetype:e.target.value}))}
                >
                    <option value="Light">Light</option>
                    <option value="Air Conditioner">Air Conditioner</option>
                    <option value="Fan">Fan</option>
                </select>
            </div>
            </form>            
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
