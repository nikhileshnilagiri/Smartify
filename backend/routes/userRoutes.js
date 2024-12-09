const express = require('express');
const router = express.Router();
const {UserDetails} = require('../model/User');
const { setToken } = require('./auth');

router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Check if email already exists
        const existingUser = await UserDetails.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" });
        }

        const user = new UserDetails({ username, email, password });
        await user.save();
        res.status(201).json({ message: "Signup successful" });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Error signing up", error: error.message });
    }
});

router.post("/addUser/guests", async (req, res) => {
    const { name, email, guestId, adminEmail } = req.body; // Destructure the data from the request body
  
    // Basic validation
    if (!name || !email || !guestId || !adminEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }
  
    try {
      // Check if the user already exists in the database
      const existingUser = await UserDetails.findOne({ email: adminEmail });
      if (!existingUser) {
        return res.status(404).json({ message: "Admin user not found" });
      }
  
      // Create a new guest object
      const newGuest = {
        name,
        email,
        guestId,
      };
  
      // Add the guest to the admin user's guest list
      existingUser.guests.push(newGuest);
  
      // Save the updated user with the new guest data
      await existingUser.save();
  
      // Respond with success
      res.status(200).json({
        message: "Guest added successfully",
        guests: existingUser.guests,
      });
    } catch (error) {
      console.error("Error saving guest:", error);
      res.status(500).json({ message: "Error saving guest", error: error.message });
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


module.exports = router;