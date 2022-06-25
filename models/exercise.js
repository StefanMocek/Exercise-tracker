const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const exerciseSchema = new Schema({
    userId: {type: String, required: true},
    description: String,
    duration: Number,
    date: Date
})

const newExercise = mongoose.model("exercise", exerciseSchema);

module.exports = newExercise