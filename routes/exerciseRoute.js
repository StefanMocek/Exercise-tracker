const express = require("express")
const router = express.Router()
const {getAllUsers, addNewUser, getAllExercises, addExercise} = require("../controllers/exerciseControllers")

router.post("/", addNewUser)

router.get("/", getAllUsers)

router.post("/:_id/exercises", addExercise)

router.get("/:_id/logs", getAllExercises)

module.exports = router