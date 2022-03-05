const { Schema, model } = require('mongoose');

const TaskSchema = new Schema({
    title: String,
    description: String,
    endingDate: String,
    duration: Number,
    recordedTime: Number,
    status: String,
    color: String,
    startStop: Boolean
});

module.exports = model('Task', TaskSchema);