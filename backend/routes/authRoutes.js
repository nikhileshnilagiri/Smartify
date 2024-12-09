const express = require('express');
const router = express.Router();
const {UserDetails} = require('../model/User');
const { setToken } = require('./auth');
const { OAuth2Client } = require("google-auth-library");
require('dotenv').config();

router.post("/signup", async (req, res) => {

    const { username, email, password } = req.body;
    console.log(username,email,password)
    try {
        const user = new UserDetails({ username, email, password });
        await user.save();
        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error signing up" });
    }
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = setToken({ username: user.username, email: user.email });
        res.status(200).json({
            authtoken: token,
            user: {
                username: user.username,
                email: user.email,
                rooms: user.rooms,
                devices: user.devices,
                activitylog: user.activitylog,
                guests: user.guests,
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error logging in" });
    }
});

router.post('/changepassword', async (req, res) => {
    const { email, password, newpass } = req.body;
    try {
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }
        user.password = newpass;
        await user.save();

        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'An error occurred while updating the password' });
    }
});

const client = new OAuth2Client(process.env.GOOGLE_AUTH_API);

router.post("/google-login", async (req, res) => {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, error: "Token not provided" });
    }
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_AUTH_API,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;
        let user = await UserDetails.findOne({ email });
        if (user) {
            const jwttoken = setToken({ username: user.username, email: user.email });
            return res.json({ success: true, user,authtoken:jwttoken});
        }
        
        const password = 'googleLogin123'
        user = new UserDetails({ username: name, email,password });
        await user.save();
        const jwttoken = setToken({ username: user.username, email: user.email });
        res.json({ success: true, user,authtoken:jwttoken });
    } catch (error) {
        console.error("Error verifying token:", error.message);
        res.status(401).json({ success: false, error: "Invalid token" });
    }
});

module.exports = router;