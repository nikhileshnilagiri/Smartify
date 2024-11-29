const bonjour = require('bonjour');
const express = require('express');
const http = require('http');
const WebSocket = require('ws');  // Import WebSocket library

const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocket.Server({ server });

// WebSocket connection handler
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');

  // Handle incoming messages
  ws.on('message', (message) => {
    console.log('Received message:', message);
  });

  // Send a message to the client
  ws.send('Hello, client!');
});

// Publish the service using Bonjour
const bonjourInstance = bonjour();
bonjourInstance.publish({ name: 'My Web Server', type: 'http', port: 8000});

// Serve a basic HTTP page
app.get('/', (req, res) => {
  res.send('Welcome to My Web Server!');
});

// Start the HTTP server
server.listen(8000, () => {
  console.log('Server is running on port 8000');
});

// Discover and log HTTP services
bonjourInstance.find({ type: 'http' }, (service) => {
  console.log('Found an HTTP server:', service);
});
