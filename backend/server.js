const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);

const wss = new WebSocket.Server({server})
app.get('/', (req, res) => {
  res.send('<h1>Welcome to the HTTP Server with Express!</h1>');
});

mongoose.connect('mongodb://localhost:27017/Database2')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const DeviceSchema = new mongoose.Schema({
    deviceid: {type:String, required: true,unique:true},
    devicename: { type: String, required: true },
    location: { type: String, required: true },
    devicetype: { type: String, required: true },
});

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rooms: [RoomSchema],
    devices: [DeviceSchema],
});

const UserDetails = mongoose.model("UserDetails", UserSchema);

app.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = new UserDetails({ username, email, password });
        await user.save();
        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing up" });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
});

app.post("/newdevice", async (req, res) => {
    const { email, devicedata } = req.body;
    if (!email || !devicedata) {
        return res.status(400).json({ message: "Email and device data are required" });
    }
    try {
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.devices.push(devicedata);
        await user.save();
        res.status(200).json({ message: "Device added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding device" });
    }
});

app.post("/newroom", async (req, res) => {
    const { email, room } = req.body;
    if (!email || !room) {
        return res.status(400).json({ message: "Email and room name are required" });
    }
    try {
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        user.rooms.push(room);
        await user.save();
        res.status(200).json({ message: "Room added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error setting up room" });
    }
});

app.post('/deletedevice', async (req, res) => {
    const { email, device } = req.body;
    try {
        const user = await UserDetails.findOne({ email });
        if (user) {
            user.devices.pull({ deviceid: device });
            await user.save();
            res.status(200).json({ message: "Device removed successfully" });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting device" });
    }
});


server.listen(8080, () => {
  console.log('Server is running on http://localhost:8080');
});
