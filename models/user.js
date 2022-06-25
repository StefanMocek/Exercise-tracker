const mongoose = require("mongoose")

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {type: String, required: true},
})

const newUser = mongoose.model("users-fcc", userSchema);

module.exports = newUser