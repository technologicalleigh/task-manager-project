const date = require(__dirname+'/modules/date');
const express = require("express");
const mongoose = require('mongoose');
const bodyParser= require('body-parser');
const app = express();

//var listItems = [];

//require('./modules/initDB');
mongoose.connect('mongodb://localhost:27017/listItemsDB', {useNewUrlParser:true});

const tasksSchema = new mongoose.Schema({
    description: String
});

const Task = mongoose.model("Task", tasksSchema);

app.use(bodyParser.urlencoded({extended: true}));
//The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));


app.get("/", (req , res) => {

    Task.find({}, function(err, foundTasks){
        res.render('../routes/list', {
            title: "Home", 
            style: "/css/home.css", 
            date: date.date, 
            time: date.time, 
            ampm: date.isAmOrPm, 
            listName: "List Ex", 
            tasks: foundTasks});
    })


});

app.post('/', (req, res) => {
    var newTaskItem = req.body.newTask;
    
    var newTask = new Task({
        description: newTaskItem
    });
    newTask.save();
    res.redirect("/")
});

app.post('/deleteItem', (req, res) => {
    var checkedTask = req.body.focused;

    Task.findByIdAndRemove(checkedTask, function(err){
        if(err){
            console.log(err);
        }
    });
    res.redirect("/")
});

app.listen(3000);