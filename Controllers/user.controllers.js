const { Userschema } = require("../Models/user.models")
// const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken")
const axios = require("axios")
const env = require("dotenv")
// const UAParser = require('ua-parser-js');
// const secret = process.env.SECRET
// const cloudinary = require("cloudinary")
const adminsecret = process.env.ADMIN_SECRET
const bcrypt = require("bcryptjs")
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
    const { email, password } = req.body;

    try {
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
    console.log(req.body);

    const mailOptions = {
        from: email,
        to: process.env.RECEIVER_MAIL,
        subject: 'New Contact Form Submission',
        html: `
            <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                <h2 style="color: #2C3E50; text-align: center; margin-bottom: 20px;">New Contact Form Submission</h2>
                <p style="color: #555; text-align: center;">You have received a new message from the contact form on your website portfolio.</p>
                
                <div style="margin-top: 20px; padding: 15px; border-top: 1px solid #ddd;">
                    <h4 style="color: #2C3E50; margin-bottom: 10px;">Sender Details:</h4>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #2980B9;">${email}</a></p>
                    <p><strong>Phone:</strong> ${phone}</p>
                </div>
    
                <div style="margin-top: 20px; padding: 15px; border-top: 1px solid #ddd;">
                    <h4 style="color: #2C3E50; margin-bottom: 10px;">Message:</h4>
                    <p style="line-height: 1.6; color: #555;">${message}</p>
                </div>
    
                <footer style="margin-top: 20px; padding: 10px; text-align: center; border-top: 1px solid #ddd; font-size: 12px; color: #999;">
                    <p>Thank you for using our service!</p>
                </footer>
            </div>
        `
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