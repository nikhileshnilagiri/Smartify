const http = require("http");
const mongoose = require("mongoose");
const socketio = require("socket.io");
const express = require("express");

const app = express();
const server = http.createServer(app);
const io = new socketio.Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

mongoose.connect('mongodb://localhost:27017/Database2')
  .then(() => console.log('MongoDB Connected!'))
  .catch((err) => console.error('MongoDB Connection Error:', err));

const RoomSchema = mongoose.Schema({
  name: { type: String }
});

const DeviceSchema = mongoose.Schema({
  devicename: { type: String },
  location: { type: String },
  devicetype: { type: String },
  status: { type: Boolean }
});

const UserSchema = mongoose.Schema({
  username: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  rooms: [RoomSchema],
  devices: [DeviceSchema]
});

const UserDetails = mongoose.model('UserDetails', UserSchema);

io.on('connection', (socket) => {
  console.log('Client Connected');

  socket.on('signup', async (data, res) => {
    try {
      const existingUser = await UserDetails({ email: data.email });
      if (existingUser) {
        return res({ status: 400, error: 'User already exists' });
      }
      const user = new UserDetails(data);
      await user.save();
      return res({ status: 200, message: 'User registered successfully' });
    } catch (error) {
      console.error('Error in signup:', error);
      return res({ status: 500, error: 'Server error' });
    }
  });

  socket.on('login', async (data, res) => {
    try {
      const user = await UserDetails.findOne({ email: data.email });
      if (user) {
        if (user.password === data.password) {
          return res({ status: 200, message: 'Login successful',data:user});
        } else {
          return res({ status: 400, error: 'Invalid password' });
        }
      } else {
        return res({ status: 400, error: 'User not found' });
      }
    } catch (error) {
      console.error('Error in login:', error);
      return res({ status: 500, error: 'Server error' });
    }
  });

  socket.on('addroom',async({email,room}, res) => {
     try {
        const user = await UserDetails.findOne({email});
        if(user){
            user.rooms.push(room);
            await user.save();
            return res({status:200});
        }
     } catch (error) {
        console.log(error);
     }
  })

  socket.on('newdevice', async ({devicedata,email},res) =>{
    try {
        const user = await UserDetails.findOne({email});
        if(user){
            user.devices.push(devicedata);
            await user.save();
            return res({status:200});
        }else{
            return res({status:400});
        }
    } catch (error) {
        console.log(error);
    }
  })
});

server.listen(5000, () => {
  console.log('Server Running');
});
