const express = require('express');
const router = express.Router();
const Project = require('../model/projectModel');

// Routes
router.post('/add', async (req, res) => {
    try {
        const projectData = {
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            area: req.body.area,
            githubLink: req.body.githubLink,
            liveLink: req.body.liveLink,
            techStack: req.body.techStack,
            images: req.body.images,
            videos: req.body.videos
        };

        const addProject = new Project(projectData);
        await addProject.save();
        
        res.status(201).json({ 
            message: 'Project added successfully', 
            project: addProject 
        });
    } catch (error) {
        console.error('Error adding Project:', error);
        res.status(500).json({ 
            message: 'Failed to add project', 
            error: error.message 
        });
    }
});

router.get('/getall', async (req, res) => {
    try {
        const projects = await Project.find();
        res.status(200).json(projects, {message: 'Projects fectched successfully'});
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({message: 'Failed to fetch projects', error: error.message})
    };
})

router.get('/get/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }
        res.status(200).json(project);
    } catch (error) {
        console.error('Error fetching project:', error);
        res.status(500).json({ message: 'Failed to fetch project', error: error.message });
    }
})

router.put('/update/:id', async (req, res) => {
    try {
        const projectData = {
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            area: req.body.area,
            githubLink: req.body.githubLink,
            liveLink: req.body.liveLink,
            techStack: req.body.techStack,
            images: req.body.images,
            videos: req.body.videos
        };

        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            projectData,
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Project updated successfully',
            project: updatedProject
        });
    } catch (error) {
        console.error('Error updating project:', error);
        res.status(500).json({ 
            message: 'Failed to update project', 
            error: error.message 
        });
    }
})

router.patch('/update/:id', async (req, res) => {
    try {
        const { description } = req.body;
        
        const updatedProject = await Project.findByIdAndUpdate(
            req.params.id,
            { description },
            { new: true }
        );

        if (!updatedProject) {
            return res.status(404).json({ message: 'Project not found' });
        }

        res.status(200).json({
            message: 'Description updated successfully',
            project: updatedProject
        });
    } catch (error) {
        console.error('Error updating description:', error);
        res.status(500).json({ 
            message: 'Failed to update description', 
            error: error.message 
        });
    }
});

router.delete('/delete/:id', async (req, res) => {
    try {
        const deleteProject = await Project.findByIdAndDelete(req.params.id);
        if (!deleteProject) {
            return res.status(404).json({ message: 'Project not found'});
        }
        res.status(200).json({ message: 'Project deleted successfully', project: deleteProject})
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({message: 'Failed to delete projects', error:error.message})
        
    }

})

module.exports = router;