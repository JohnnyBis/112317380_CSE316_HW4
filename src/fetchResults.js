const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const app = express();
const port = 8000;
const cors = require('cors');

let url = "mongodb+srv://testUser:test1234@cluster0.9olz5.mongodb.net/ClassFind?retryWrites=true";

app.use(bodyParser.urlencoded({
  extended: false
}))

app.use(bodyParser.json());

//Cors Configuration
app.use(cors({
  origin: true
}));

const savedCoursesSchema = new mongoose.Schema({
  _id: ObjectId,
  saved_courses: Array
});

const SavedCourses = mongoose.model('SavedCourses', savedCoursesSchema);

app.get("/queryDB", (req, res) => {
  MongoClient.connect(url, async function (err, client) {
    if (err) {
      throw new Error('Database failed to connect!');
    } else {
      console.log('MongoDB successfully connected on port 8000.');
    }

    const db = client.db("ClassFind");
    let collection = db.collection("cse-courses");

    let cursor = collection.find({}).sort({
      CRS: -1
    });

    const temp = await cursor.toArray();
    res.json(temp);
  });
});

app.get("/queryDB/all_fields/:allFields", (req, res) => {
  MongoClient.connect(url, async function (err, client) {
    if (err) {
      throw new Error('Database failed to connect!');
    } else {
      console.log('MongoDB successfully connected on port 8000.');
    }

    let allFields = req.params.allFields;

    const db = client.db("ClassFind");
    let collection = db.collection("cse-courses");
    
    let cursor = collection.find({
      "Title": {
        $regex: `${title}`, $options: 'i'
      }
    });
    
    const temp = await cursor.toArray();
    res.json(temp);
  });
});

app.get("/queryDB/id/:id", (req, res) => {
  MongoClient.connect(url, async function (err, client) {
    if (err) {
      throw new Error('Database failed to connect!');
    } else {
      console.log('MongoDB successfully connected on port 8000.');
    }

    let courseId = req.params.id;

    const db = client.db("ClassFind");
    let collection = db.collection("cse-courses");
    let cursor = collection.find({
      "_id": ObjectId(courseId.toString())
    });
    
    const temp = await cursor.toArray();
    res.json(temp);
  });
});

app.get('/queryDB/title/:title', (req, res) => {
  MongoClient.connect(url, async function (err, client) {
    let title = req.params.title;

    const db = client.db("ClassFind");
    let collection = db.collection("cse-courses");

    let cursor = collection.find({
      "Title": {
        $regex: `${title}`, $options: 'i'
      }
    });
    const temp = await cursor.toArray();
    res.json(temp);
  });
});

app.get('/queryDB/class_number/:classNumber', (req, res) => {
  MongoClient.connect(url, async function (err, client) {
    let classNumber = req.params.classNumber;
    const db = client.db("ClassFind");
    let collection = db.collection("cse-courses");
    console.log(classNumber);
    let cursor = collection.find({
      "CRS": parseInt(classNumber)
    });
    const temp = await cursor.toArray();
    res.json(temp);
  });
});

app.get('/queryDB/days/:days', (req, res) => {
  MongoClient.connect(url, async function (err, client) {
    try {
      let days = req.params.days;
      const db = client.db("ClassFind");
      let collection = db.collection("cse-courses");
      let cursor = collection.find({
        "Days": { $regex:`^${days}$`, $options: 'i'}
      });
      const temp = await cursor.toArray();
      res.json(temp);
    }catch (err){
      console.log(err);
    }
  });
});

app.get('/queryDB/time/:times', (req, res) => {
  MongoClient.connect(url, async function (err, client) {
    try {
      let times = req.params.times;
      const db = client.db("ClassFind");
      let collection = db.collection("cse-courses");
      let cursor = collection.find({ $or:[
          {"Start Time":{$regex:`${times}`, $options: 'i'}},
          {"End Time":{$regex:`${times}`, $options: 'i'}}
        ]
      });
      const temp = await cursor.toArray();
      res.json(temp);
    }catch (err){
      console.log(err);
    }
  });
});

app.get('/queryDB/getSavedClasses', (req, res) => {
  MongoClient.connect(url, async function (err, client) {
    try {
      const db = client.db("ClassFind");
      let collection = db.collection("saved-schedule");
      let cursor = collection.find({
        _id: ObjectId("5f9b31b2f438aaed4e3e8ade")
      });
      const temp = await cursor.toArray();
      res.json(temp);
    }catch (err){
      console.log(err);
    }
  });
});
  

app.post('/queryDB/postSavedClasses', (req, res) => {
  MongoClient.connect(url, function (err, client) {
    try {
      const db = client.db("ClassFind");
      let collection = db.collection("saved-schedule");
      let courseList = req.body['course_list[]'];
      const objectList = SavedCourses({
        _id: ObjectId("5f9b31b2f438aaed4e3e8ade"),
        saved_courses: courseList
      });
      collection.updateOne({_id: ObjectId("5f9b31b2f438aaed4e3e8ade")}, {$set: objectList}, {upsert:true});
      
    }catch (err){
      console.log(err);
    }
  });
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
})