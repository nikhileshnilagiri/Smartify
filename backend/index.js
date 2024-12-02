const bonjour = require('bonjour');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  ws.send('Hello, client!');
});

const bonjourInstance = bonjour();
bonjourInstance.publish({ name: 'My Web Server', type: 'http', port: 8000, host:'backend.local'});


app.get('/', (req, res) => {
  res.send('Welcome to My Web Server!');
});

server.listen(8000, () => {
  console.log('Server is running on port 8000');
});

bonjourInstance.find({ type: 'http' }, (service) => {
  console.log('Found an HTTP server:', service);
});
