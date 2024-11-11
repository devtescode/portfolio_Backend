const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: String,
    projectName: String,
    deployLink: String,
    projectType: { type: String, enum: ['New', 'Old'], required: true },
});

module.exports = mongoose.model('Image', imageSchema);
