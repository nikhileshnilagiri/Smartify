const mongoose = require('mongoose');

// Device Schema
const DeviceSchema = new mongoose.Schema({
    deviceid: { type: String, required: true },
    devicename: { type: String, required: true },
    location: { type: String, required: true },
    devicetype: { type: String, required: true },
});

// Room Schema
const RoomSchema = new mongoose.Schema({
    name: { type: String, required: true }
});

// Activity Schema
const ActivitySchema = new mongoose.Schema({
    action: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// User Schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    rooms: [RoomSchema],
    devices: [DeviceSchema],
    activitylog: [ActivitySchema],
    guestUsers: [  // New field to store guest users
        {
            name: { type: String, required: true },
            email: { type: String, required: true, unique: true },
            guestId: { type: String, required: true, unique: true }
        }
    ]
});

const UserDetails = mongoose.model("UserDetails", UserSchema);

module.exports = { UserDetails };
