const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");
const newUser = require("./models/user");
const newExercise = require("./models/exercise")
const bodyParser = require("body-parser")

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

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.post("/api/users", async (req,res)=>{
  try {
      // console.log("req.body: ", req.body);
      const newUzytkownik = new newUser({
          username: req.body.username
      })

      await newUser.create(newUzytkownik)

     res.send({"username": newUzytkownik.username, "_id": newUzytkownik._id})
      
  } catch (err){
      console.error(err)
  }
})



app.get("/api/users", (req,res)=>{
  newUser.find({}, (err,result)=>{
    // console.log(result);
    res.status(200).json(result);
  })
})


app.post("/api/users/:_id/exercises", (req,res)=>{
    // console.log(req.body, req.params);
    const id = req.params._id;
    const description = req.body.description;
    const duration = req.body.duration;
    const dateEx = req.body.date
    
    // console.log(id)
      newUser.findById(id, (err, user)=>{
        if(err||!user){
          res.send("Can't find the user")
        }else if (!description||!duration){
          res.send("Require description and duration")
        }else if (!dateEx){
          const newEx = new newExercise({
            userId : id,
            description,
            duration,
            date: new Date()
          })
          newEx.save((err,data)=>{
            if (err||!data){
              res.send("Can't add the exercise")
            }else{
              const {description, duration, date} = data;
              res.json({
                username: user.username,
                description,
                duration, 
                date: date.toDateString(),
                _id:user.id
              })
            } 
          })
        }else {
          const newEx = new newExercise({
            userId : id,
            description,
            duration,
            date: new Date(dateEx)
          })
          newEx.save((err,data)=>{
            if (err||!data){
              res.send("Can't add the exercise")
            }else{
              const {description, duration, date} = data;
              res.json({
                username: user.username,
                description,
                duration, 
                date: date.toDateString(),
                _id:user.id
              })
            } 
          })
        }
      })
})

app.get("/api/users/:_id/logs",(req,res)=>{
  // console.log("req.query: ", req.query, "req.params:", req.params)
  const id = req.params._id;
  const {from, to, limit} = req.query;
  // console.log("id:", id)
  newUser.findById(id, (err, user)=>{
    if(err||!user){
      res.send("Can't find the user")
    }else{
      let ograniczenie = {
        userId: id
      }
      let ograniczenieDat = {}
        if (from){
          ograniczenieDat["$gte"]= new Date(from)
        }
        if (to){
          ograniczenieDat["$lte"] = new Date(to)
        }
        if (from||to){
          ograniczenie.date = ograniczenieDat
        }
        let nonNull = (limit !== null && limit !== undefined) ? limit : 500; 
        newExercise.find(ograniczenie).limit(Number(nonNull)).exec((err,data)=>{
          if (err||!data){
            res.json({})
          }else {
            const username = user.username;
            const _id = user._id;
            const count = data.length;
            const log = data.map((x)=>({
            description: x.description.toString(),
            duration: x.duration, 
            date: x.date.toDateString()
          }))
          res.json({_id, username, count, log})
          }
        })
    }
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})

// app.post("/api/users", (req,res)=>{
//   const newUzytkownik = new newUser({
//     username: req.body.username
//   })
//   newUzytkownik.save((err,data)=>{
//     if (err||!data){
//       req.send("Error")
//     }else {
//       res.json(data)
//     }
//   })
// })