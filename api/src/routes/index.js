const { Router } = require('express');

const task = require('../models/Task');
const router = Router();

router.post('/create', async (req, res) => {
    const dataTask = req.body;
    await task.create(dataTask);
    return res.status(201).json('ImplementedTask');
});

router.get('/task', async (req, res) => {
    const tasks = await task.find();
    res.json({ tasks });
});

router.put('/updateTask', async (req, res) => {
    task.updateOne({ _id: req.body._id }, req.body, () => { });
    return res.status(201).json('updatedTask');
});

router.put('/deletedTask', async (req, res) => {
    task.updateOne({ _id: req.body._id }, req.body, () => { });
    return res.status(201).json('deletedTask');
});

module.exports = router;