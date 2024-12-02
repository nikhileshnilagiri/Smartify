const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const server = http.createServer(app);

const device = [];

const wss = new WebSocket.Server({server});

app.get('/', (req, res) => {
  res.send('<h1>Welcome to the HTTP Server with Express!</h1>');
});

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.error("MongoDB connection error:", err));

app.post('/modeldata',async (req,res)=>{
    console.log("Recived Request");
    console.log(req.body);
    
    res.status(200);
})


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

server.listen(process.env.PORT, () => {
    console.log(`Server is running on http://localhost:${process.env.PORT}`);
});