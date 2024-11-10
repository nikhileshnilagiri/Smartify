const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const device = [];

app.get('/', (req, res) => {
    res.send('<h1>Welcome to the HTTP Server with Express!</h1>');
});

app.get('/about', (req, res) => {
    res.send('<h1>About Page</h1><p>This is a sample HTTP route served by Express.</p>');
});

wss.on('connection', (ws) => {
    console.log('Client connected');
    ws.send('Welcome to the WebSocket server!');

    const cleanDeviceList = device.map(dev => {
        // Return a new object without the WebSocket object
        return { deviceid: dev.deviceid, status: dev.status };
    });

    const deviceListMessage = JSON.stringify({ type: 'DEVICE_LIST', devices: cleanDeviceList });
    ws.send(deviceListMessage);

    ws.on('message', (message) => {
        console.log(`Received message from client: ${message}`);

        let messageStr = (typeof message === 'string') ? message : message.toString();

        if (messageStr.startsWith('ESP32')) {
            const deviceId = messageStr.trim();

            const deviceIndex = device.findIndex(dev => dev.deviceid === deviceId);

            if (deviceIndex === -1) {
                device.push({ deviceid: deviceId, status: 'OFF', ws: ws });
                console.log(`Device ${deviceId} added to the list.`);
            } else {
                console.log(`Device ${deviceId} is already in the list.`);
            }

            const cleanDeviceList = device.map(dev => {
                return { deviceid: dev.deviceid, status: dev.status };
            });

            const updatedDeviceListMessage = JSON.stringify({ type: 'DEVICE_LIST', devices: cleanDeviceList });
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(updatedDeviceListMessage);
                }
            });
        }

        if (messageStr === 'TURN_ON') {
            console.log('Broadcasting TURN_ON message to all clients');
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('TURN_ON');
                }
            });
        } else if (messageStr === 'TURN_OFF') {
            console.log('Broadcasting TURN_OFF message to all clients');
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('TURN_OFF');
                }
            });
        } else if (messageStr === 'hey') {
            console.log('Broadcasting hey message to all clients');
            wss.clients.forEach(client => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send('hey');
                }
            });
        }
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');

        const index = device.findIndex(dev => dev.ws === ws);
        if (index !== -1) {
            device.splice(index, 1);
        }

        const cleanDeviceList = device.map(dev => {
            return { deviceid: dev.deviceid, status: dev.status };
        });

        const updatedDeviceListMessage = JSON.stringify({ type: 'DEVICE_LIST', devices: cleanDeviceList });
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
