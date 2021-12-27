const date = require(__dirname+'/modules/date');
const express = require("express");
const mongoose = require('mongoose');
const htmlparser2 = require("htmlparser2");
const CSSselect = require("css-select");
const bodyParser= require('body-parser');
const app = express();

// const dom = htmlparser2.parseDocument(htmlString);
//var listItems = [];

//require('./modules/initDB');
mongoose.connect('mongodb://localhost:27017/listItemsDB', {useNewUrlParser:true});

// const tasksSchema = new mongoose.Schema({
//     description: String
// });

// const Task = mongoose.model("Task", tasksSchema);
// const listSchema = new mongoose.Schema({
//     name: String,
//     tasksItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Task' }]
// });

const listSchema = new mongoose.Schema({
        name: String,
        tasksItems: []
});

const Lists = mongoose.model("List", listSchema);

app.use(bodyParser.urlencoded({extended: true}));
//The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

//var newListName = express.static(__dirname + ');

//task lists
app.get("/lists", (req , res) => {

    Lists.find({}, function(err, foundLists){
        res.render('../routes/lists', {
            title: "Task Manager", 
            style: "/css/home.css", 
            date: date.date, 
            time: date.time, 
            ampm: date.isAmOrPm, 
            lists: foundLists,
            errorTrue: false
        });
    });

});

app.post('/lists', (req, res) => {
    var newList = req.body.newList;
    
    Lists.findOne({name: newList}, function(err, customList){
        if(err){
            console.log(err);
        }else if(!customList){
            var newList = new Lists({
                name: newList,
                tasksItems: []
            });
            newList.save();
        } else if(customList){
            res.render('../routes/lists', {
                title: "Task Manager", 
                style: "/css/home.css", 
                date: date.date, 
                time: date.time, 
                ampm: date.isAmOrPm, 
                lists: customLists,
                errorTrue: true,
                error:'Error: Can\'t create two duplicate lists'
            });
        }
    });
    res.redirect("/lists")
});

app.post('/deleteList', (req, res) => {
    var checkedList = req.body.focused;

    Lists.findByIdAndRemove(checkedList, function(err){
        if(err){
            console.log(err);
        }
    });
    res.redirect("/lists")
});


//creating populating custom lists
app.get("/:customListName", (req , res) => {
    const customName = req.params.customListName.toLowerCase();

    Lists.findOne({name: customName}, function(err, customList){
        if(err){
            console.log(err)
        }

        res.render('../routes/list', {
                title: customName,
                style: "/css/home.css",
                date: date.date, 
                time: date.time, 
                ampm: date.isAmOrPm, 
                listname: customName,
                listName: customName, 
                tasks: customList.tasksItems
            });
    });
});


app.post("/addCustomTask", (req, res) => {
    var customName = req.body.listname;
    var newTaskItem = req.body.newTask;

    newTas

    Lists.findOne({name: customName}, function(err, customList){
        if(err){
            console.log(err);
        }
        customList.tasksItems.push(newTaskItem);
        customList.save()
    });
 
    res.redirect('/'+customName);
});

app.post('/deleteCustomTask', (req, res) => {
    var customName = req.body.listname;
    var checkedItem = req.body.focused;
    customName = customName.toLowerCase();
    Lists.findOneAndUpdate({name: customName}, { $pull: {tasksItems: checkedItem}} , function(err, customList){
        if(err){
            console.log(err);
        }
    });

    res.redirect("/"+customName);
});



app.listen(3000);