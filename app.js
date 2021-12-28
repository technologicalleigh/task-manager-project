const date = require(__dirname+'/modules/date');
const express = require("express");
const mongoose = require('mongoose');
const htmlparser2 = require("htmlparser2");
const CSSselect = require("css-select");
const bodyParser= require('body-parser');
const app = express();


mongoose.connect('mongodb://localhost:27017/listItemsDB', {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    password: String,
    lists: {
        name: String,
        taskItems: []
    }
});

const Users = mongoose.model("User", userSchema);

const listSchema = new mongoose.Schema({
        name: String,
        tasksItems: []
});

const Lists = mongoose.model("List", listSchema);

app.use(bodyParser.urlencoded({extended: true}));
//The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));


app.get('/', (req, res) => {
   res.render('../routes/home', {
        title: "Home",
        style: "/css/home.css"
   }); 
});

app.get('/createUser', (req, res)=> {
    res.render('../routes/createUser', {
        title: "Home",
        style: "/css/home.css" 
   }); 
});

app.post('/addUser', (req, res) => {
    var userName = req.body.username;
    var firstName = req.body.firstname;
    var password = req.body.password;
    
    console.log(req.body);
    console.log(userName + '\n' + firstName + '\n' + password);

    Users.findOne({name: userName}, function(err, foundUser){
        if(err){
            console.log(err);
        }else if(!foundUser){
            var addUser = new Users({
                username: userName,
                firstname: firstName,
                password: password
            });
            addUser.save();
            res.redirect("/")
        } else if(foundUser){
           res.redirect('/userAlreadyExists')
        }
    });
});

app.get('/login', (req, res) => {
    res.render('../routes/home', {
        title: "Home",
        style: "/css/home.css" 
   }); 
});

app.post('/loginUser', (req, res) => {
    res.redirect('/lists');
});

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
        });
    });

});

app.post('/lists', (req, res) => {
    var newList = req.body.newList;
    
    Lists.findOne({name: newList}, function(err, customList){
        if(err){
            console.log(err);
        }else if(!customList){
            var addList = new Lists({
                name: newList,
                tasksItems: []
            });
            addList.save();
            res.redirect("/lists")
        } else if(customList){
           res.redirect('/duplicatedList')
        }
    });
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


app.get('/duplicatedList',  (req , res) => {

    Lists.find({}, function(err, foundLists){
        console.log(foundLists);
        res.render('../routes/duplicatedList', {
            title: "Task Manager", 
            style: "/css/home.css", 
            date: date.date, 
            time: date.time, 
            ampm: date.isAmOrPm, 
            lists: foundLists
        });
    });
});

app.post('/duplicatedListPgAddList', (req, res) => {
    var newList = req.body.newList;
    
    Lists.findOne({name: newList}, function(err, customList){
        if(err){
            console.log(err);
        }else if(!customList){
            var addList = new Lists({
                name: newList,
                tasksItems: []
            });
            addList.save();
            res.redirect("/lists")
        } else if(customList){
           res.redirect('/duplicatedList')
        }
    });
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