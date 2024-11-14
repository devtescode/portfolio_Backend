const { Userschema } = require("../Models/user.models")
// const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const env = require("dotenv")
// const UAParser = require('ua-parser-js');
// const secret = process.env.SECRET
// const cloudinary = require("cloudinary")
const adminsecret = process.env.ADMIN_SECRET
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
// const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose")
// const cron = require('node-cron');

env.config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.RECEIVER_MAIL, // Replace with your email
        pass: process.env.App_Password // Replace with your app password
    }
});

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRETCLOUD
// });



module.exports.userWelcome = (req, res) => {
    console.log("You are welcomme.");
}


module.exports.register = async (req, res) => {
    // console.log(req.body);
    const { email, password } = req.body;

    try {
        // Check if an admin already exists
        const existingAdmin = await Userschema.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Admin already registered' });
        }

        const newAdmin = new Userschema({ email, password });
        await newAdmin.save();
        // console.log(newAdmin);


        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering admin', error });
        console.log('Error registering admin', error);

    }
}


module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const admin = await Userschema.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id, role: admin.role }, adminsecret, { expiresIn: '1h' });
        res.json({ status: true, message: 'Login successful', token });
        // console.log(token);

    } catch (error) {
        res.status(500).json({ message: 'Login failed', error });
        console.log('Login failed', error);

    }
}

module.exports.check = async (req, res) => {
    try {
        const existingAdmin = await Userschema.findOne({ role: 'admin' });
        res.json({ isAdminRegistered: !!existingAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error checking admin registration', error });
    }
}

module.exports.contact = async (req, res) => {
    const { name, email, phone, message } = req.body;
    const mailOptions = {
        from: email,
        to: process.env.RECEIVER_MAIL, // Replace with your receiving email
        subject: 'New Contact Form Submission',
        text: `You have a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Message sent successfully!' });
        console.log("Message sent successfully");
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to send message' });
    }
}