const express = require('express');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bonjour = require('bonjour');
require('dotenv').config();

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