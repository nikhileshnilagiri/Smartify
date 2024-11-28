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

const device = [];

const wss = new WebSocket.Server({server});

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the HTTP Server with Express!</h1>');
});

mongoose.connect('mongodb://localhost:27017/Database2')
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

const DeviceSchema = new mongoose.Schema({
    deviceid: {type:String, required: true},
    devicename: { type: String, required: true },
    location: { type: String, required: true },
    devicetype: { type: String, required: true },
});

const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

const ActivitySchema = new mongoose.Schema({
    action:{type: String, required:true},
    timestamp:{type:Date,default:Date.now}
})

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rooms: [RoomSchema],
    devices: [DeviceSchema],
    activitylog:[ActivitySchema]
});

const UserDetails = mongoose.model("UserDetails", UserSchema);

app.get("/temperature", async (req, res) => {
    try {
        const response = await fetch("http://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=1502e8f9ae85a5e3111be130792f5e5b", {
            method: "GET",
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data from OpenWeather API", details: await response.json() });
        }
        const data = await response.json();
        const temperatureInKelvin = data.main.temp;
        const temperatureInCelsius = temperatureInKelvin - 273.15;
        const temp = Math.round(temperatureInCelsius);
        res.status(200).json({temp:temp});
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/humidity", async (req, res) => {
    try {
        const response = await fetch("http://api.openweathermap.org/data/2.5/weather?q=Hyderabad&appid=1502e8f9ae85a5e3111be130792f5e5b", {
            method: "GET",
        });

        if (!response.ok) {
            return res.status(response.status).json({ error: "Failed to fetch data from OpenWeather API", details: await response.json() });
        }
        const data = await response.json();
        res.status(200).json({humidity:data.main.humidity});
    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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

app.post('/modeldata',async (req,res)=>{
    console.log("Recived Request");
    console.log(req.body);
    
    res.status(200);
})

app.post('/updatedevice', async (req, res) => {
    const { email, deviceData} = req.body;
    try {
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const updateuser = await UserDetails.updateOne(
            { email: email, 'devices.deviceid': deviceData.deviceid },
            { $set: { 'devices.$': deviceData } }
        );

        if (updateuser.modifiedCount === 0) {
            return res.status(404).json({ message: 'Device not found or no update needed' });
        }
        res.status(200).json({ message: 'Device data updated successfully' });
    } catch (error) {
        console.error('Error updating device data:', error);
        res.status(500).json({ message: 'An error occurred while updating the device data' });
    }
});

app.post('/changepassword', async (req, res) => {
    const { email, password, newpass } = req.body;

    try {
        const result = await UserDetails.updateOne(
            { email, password },
            { $set: { password: newpass } }
        );

        if (result.matchedCount === 0) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send('Welcome to the WebSocket server!');

    const cleanDeviceList = device.map(dev => ({
        deviceid: dev.deviceid,
        status: dev.status
    }));

    const deviceListMessage = JSON.stringify({ type: 'DEVICE_LIST', devices: cleanDeviceList });
    ws.send(deviceListMessage);

    ws.on('message', (message) => {
        console.log(`Received message from client: ${message}`);

        let messageStr = (typeof message === 'string') ? message : message.toString();
        let parsedMessage;

        try {
            parsedMessage = JSON.parse(messageStr);
        } catch (error) {
            console.log('Invalid JSON message received:', messageStr);
            return;
        }

        if (parsedMessage.type === 'DEVICE_LIST') {
            const deviceId = parsedMessage.deviceid.trim();
            const deviceIndex = device.findIndex(dev => dev.deviceid === deviceId);

            if (deviceIndex === -1) {
                device.push({ deviceid: deviceId, status: 'OFF', ws: ws });
                console.log(`Device ${deviceId} added to the list.`);
            } else {
                console.log(`Device ${deviceId} is already in the list.`);
            }

            const updatedDeviceListMessage = JSON.stringify({ type: 'DEVICE_LIST', devices: device.map(dev => ({
                deviceid: dev.deviceid,
                status: dev.status
            })) });

            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(updatedDeviceListMessage);
                }
            });
        } 

        else if (parsedMessage.type === 'LIGHT_CONTROL') {
            console.log('Broadcasting TURN_ON message to all clients');
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type:'LIGHT_CONTROL',deviceid:parsedMessage.deviceid}));
                }
            });
        } 

        else if (parsedMessage.type === 'FAN_CONTROL') {
            console.log('Brodcasting Fan Control to all clients');
            wss.clients.forEach(client =>{
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: 'FAN_CONTROL',deviceid:parsedMessage.deviceid}));
                }
            })
        }

        else if (parsedMessage.type === 'AC_CONTROL') {
            console.log('Brodcasting AC Control to all Clients');
            wss.clients.forEach(client => {
                if(client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type: 'AC_CONTROL',deviceid:parsedMessage.deviceid}));
                }
            })
        }
        else if (parsedMessage.type === 'DEVICE_STATUS'){
            console.log('Brodcasting Status to all Clients');
            wss.clients.forEach(client => {
                if(client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({type:"DEVICE_STATUS",controltype:parsedMessage.controltype,deviceid:parsedMessage.deviceid,status:parsedMessage.status}));
                }
            })
        }


    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
        const index = device.findIndex(dev => dev.ws === ws);
        if (index !== -1) {
            device.splice(index, 1);
        }
        const updatedDeviceListMessage = JSON.stringify({ type: 'DEVICE_LIST', devices: device.map(dev => ({
            deviceid: dev.deviceid,
            status: dev.status
        })) });

        wss.clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(updatedDeviceListMessage);
            }
        });
    });
});

server.listen(8080, () => {
    console.log('Server is running on http://localhost:8080');
});