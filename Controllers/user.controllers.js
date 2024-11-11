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
// const { v4: uuidv4 } = require('uuid');
const mongoose = require("mongoose")
// const cron = require('node-cron');

env.config()

// var transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         user: process.env.USER_EMAIL,
//         pass: process.env.USER_PASSWORD
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

// cloudinary.config({
//     cloud_name: process.env.CLOUD_NAME,
//     api_key: process.env.API_KEY,
//     api_secret: process.env.API_SECRETCLOUD
// });



module.exports.userWelcome = (req, res)=>{
    console.log("You are welcomme.");
}


module.exports.register =  async (req, res)=>{
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
        console.log( 'Error registering admin', error);
        
    }
}


module.exports.login = async(req, res) => {
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

module.exports.check = async(req, res) => {
    try {
        const existingAdmin = await Userschema.findOne({ role: 'admin' });
        res.json({ isAdminRegistered: !!existingAdmin });
    } catch (error) {
        res.status(500).json({ message: 'Error checking admin registration', error });
    }
}

// module.exports.uploadimage = (req, res) => {

// }