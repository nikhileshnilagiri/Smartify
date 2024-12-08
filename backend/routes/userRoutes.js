const express = require('express');
const router = express.Router();
const {UserDetails} = require('../model/User');
const { setToken } = require('./auth');

router.post("/signup", async (req, res) => {
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
router.post('/saveUser', async (req, res) => {
    const { name,email,guestId,adminEmail } = req.body;
    try {
        const user = await UserDetails.findOne({ email: adminEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Adding guest to the user's guestUsers array
        user.guestUsers.push({ name: name, email: email, guestId });
        await user.save();

        res.status(200).json({ message: "Guest user added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding guest user" });
    }
});

module.exports = router;