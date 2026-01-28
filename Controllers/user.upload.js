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
                    projectcode: req.body.projectcode, // Save projectType
                    description: req.body.description, // Save projectType
                });
                console.log(newImage, "uploaded success");


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
        const projects = await Image.find();
        res.json(projects);
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
    console.log(req.body);
    
    try {
        const updatedProject = await Image.findByIdAndUpdate(
            req.params.id,
            {
                projectName: req.body.projectName,
                description: req.body.description,
                url: req.body.url,
                deployLink: req.body.deployLink,
                projectcode: req.body.projectcode,
            },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/projectnumbers', async (req, res) => {
    try {
        // Count all projects
        const allProjects = await Image.countDocuments();

        // Count projects by type
        const oldProjects = await Image.countDocuments({ projectType: 'Old' });
        const newProjects = await Image.countDocuments({ projectType: 'New' });

        // Send counts as response
        res.json({
            allProjects,
            oldProjects,
            newProjects,
        });
    } catch (error) {
        console.error('Error fetching project numbers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;
