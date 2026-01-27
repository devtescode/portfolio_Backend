const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema({
    url: String,
    projectName: String,
    deployLink: String,
    projectcode: String,
    description: String,
});

module.exports = mongoose.model('Image', imageSchema);
