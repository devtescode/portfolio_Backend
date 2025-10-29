const mongoose = require('mongoose')
const bcrypt = require('bcryptjs');


let adminSchema = mongoose.Schema({
    // Email: { type: String, unique: true, required: true },
    // Password: { type: String, required: true }
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: 'admin',
    },
    
})


adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});



const Userschema = mongoose.model("portfolio", adminSchema)
module.exports = {Userschema}