const express = require('express');
const router = express.Router();
const cloudinary = require('./cloudinaryConfig'); // import the config
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' }); // specify upload location
const upload = multer({ storage: multer.memoryStorage() });
const Image = require('../Models/user.image'); // Your MongoDB model for images

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

router.post('/upload', upload.single('image'), async (req, res) => {
    try {
        const result = await cloudinary.uploader.upload_stream(
            { resource_type: 'image' },
            async (error, result) => {
                if (error) return res.status(500).json({ error: 'Cloudinary upload failed' });

                const newImage = new Image({
                    url: result.secure_url,
                    projectName: req.body.projectName,
                    deployLink: req.body.deployLink,
                    projectType: req.body.projectType, // Save projectType
                });

                await newImage.save();
                res.status(200).json({ imageUrl: result.secure_url });
            }
        );

        result.end(req.file.buffer);
    } catch (error) {
        console.error(error);
        res.status(500).send('Image upload failed');
    }
});


router.get('/images', async (req, res) => {
    const { projectType } = req.query; // Get filter type from query

    try {
        // If projectType is provided, filter by projectType, else get all images
        const filter = projectType ? { projectType } : {};
        const images = await Image.find(filter);

        if (!images || images.length === 0) {
            return res.status(404).json({ error: 'No images found' });
        }

        console.log('Fetched Images:', images);
        res.json(images);

    } catch (error) {
        console.error('Error fetching images:', error);
        res.status(500).json({ error: 'Failed to fetch images' });
    }
});


router.get('/projects', async (req, res) => {
    try {
        const projects = await Image.find(); // Assuming you have a MongoDB schema called Project
        res.json(projects); // Send the list of projects back as JSON
        console.log(projects);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.delete('/projects/:id', async (req, res) => {
    try {
        const project = await Image.findByIdAndDelete(req.params.id);
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.send('Project deleted');
    } catch (error) {
        res.status(500).send('Server error');
    }
});


router.put('/projects/:id', async (req, res) => {
    try {
        const { projectName, deployLink, projectType } = req.body;
        const project = await Image.findByIdAndUpdate(req.params.id, { projectName, deployLink, projectType }, { new: true });
        if (!project) {
            return res.status(404).send('Project not found');
        }
        res.json(project);
    } catch (error) {
        res.status(500).send('Server error');
    }
});


module.exports = router;
