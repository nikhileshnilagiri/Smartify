const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bonjour = require('bonjour');
require('dotenv').config();
const {UserDetails} = require('./model/User'); // Adjust the path as per your folder structure


//local Imports
const userRoutes = require('./routes/userRoutes');
const deviceRoutes = require('./routes/deviceRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const {handleConnection} = require('./routes/socketMessages');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);
const bonjourInstance = bonjour();

bonjourInstance.publish({
 name: 'My WebSocket Server',
   type: 'websocket',
  port: 8080,
   host: 'backend.local'
});

const wss = new WebSocket.Server({server});

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the HTTP Server with Express!</h1>');
});

app.post("/user/add", async (req, res) => {
    const { name, email, guestId, adminEmail } = req.body;

    try {
        // Find the admin user by email
        const adminUser = await UserDetails.findOne({ email: adminEmail });
        if (!adminUser) {
            return res.status(404).json({ message: "Admin user not found" });
        }

        // Add the guest to the admin's guest list
        adminUser.guests.push({ name, email, guestId });
        await adminUser.save();

        res.status(201).json({ message: "Guest added successfully", guests: adminUser.guests });
    } catch (error) {
        console.error("Error adding guest:", error);
        res.status(500).json({ message: "Failed to add guest", error: error.message });
    }
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.post('/modeldata',async (req,res)=>{
    console.log("Recived Request");
    console.log(req.body);
    
    res.status(200);
})

app.use('/',serviceRoutes);
app.use('/user',userRoutes);
app.use('/device',deviceRoutes);


wss.on('connection', (ws) => {
    handleConnection(ws, wss);
});

server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
bonjourInstance.find({ type: 'websocket' }, (service) => { 
    console.log('Found a WebSocket server:', service);
});