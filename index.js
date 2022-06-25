const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");
const bodyParser = require("body-parser")
const exerciseRoute = require("./routes/exerciseRoute")
const {home} = require("./controllers/exerciseControllers")

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const connection = mongoose.connection;
connection.once("open", ()=>{
    console.log("MongoDB database connection extablished");
})

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended:"false"}))
app.use(bodyParser.json())

app.get('/', home);

app.use("/api/users", exerciseRoute)


const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
