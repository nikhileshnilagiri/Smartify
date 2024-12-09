const express = require('express');
const router = express.Router();
const {UserDetails} = require('../model/User');
const { setToken } = require('./auth');
const nodemailer = require('nodemailer');

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

  
//node mailer

// Nodemailer transport configuration
const transporter = nodemailer.createTransport({
    service: 'gmail', // You can choose other services like SendGrid or SMTP
    auth: {
        user: process.env.sender_email,
        pass: process.env.App_Pass,
    },
});

// Generate a random OTP (6 digits)
const otpStore = new Map(); // In-memory store for OTPs

// Generate OTP
const generateOTP = () => {
    let otp = '';
    for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
    }
    return otp;
};

// Forgot Password Route: Send OTP
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await UserDetails.findOne({ email });
        console.log(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOTP();
        otpStore.set(email, otp); // Store OTP in the in-memory store

        console.log(`OTP for ${email}: ${otp}`);

        const mailOptions = {
            from: 'Smartify <maheshn0802@gmail.com>',
            to: email,
            subject: 'Password Reset OTP',
            text: `Your OTP for resetting your password is: ${otp}`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending mail:', error);
                return res.status(500).json({ message: 'Failed to send OTP' });
            }
            res.status(200).json({ message: 'OTP sent to email' });
        });
    } catch (error) {
        console.error('Error in forgot-password:', error);
        res.status(500).json({ message: 'Error sending OTP' });
    }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
    const { email, otp, newPassword } = req.body;

    try {
        const storedOtp = otpStore.get(email); // Get OTP from in-memory store
        if (!storedOtp) {
            return res.status(400).json({ message: 'OTP expired or not requested' });
        }

        console.log(`Stored OTP: ${storedOtp}, Provided OTP: ${otp}`); // Debugging log

        if (storedOtp !== otp) {
            return res.status(400).json({ message: 'Incorrect OTP' });
        }

        

        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.password = newPassword;
        otpStore.delete(email); // Remove OTP from the in-memory store
        await user.save();

        res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        console.error('Error in reset-password:', error);
        res.status(500).json({ message: 'Error resetting password' });
    }
});



  
module.exports = router;