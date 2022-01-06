require('dotenv').config();
const date = require(__dirname+'/modules/date');
const express = require("express");
const mongoose = require('mongoose');
const htmlparser2 = require("htmlparser2");
const CSSselect = require("css-select");
const bodyParser= require('body-parser'); 
const app = express();

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
    username: String,
    firstname: String,
    password: String,
    lists: {
        listname: String,
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

   Users.find(function(err, foundUser){
       console.log(foundUser);
   });
});

app.get('/duplicateUser', (req, res)=> {
    res.render('../routes/duplicateUser', {
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

    Users.findOne({username: userName}, function(err, foundUser){
        if(err){
            console.log(err);
        }else if(!foundUser){
            var addUser = new Users({
                username: userName,
                firstname: firstName,
                password: password
            });
            addUser.save();
            res.redirect("/");
        } else if(foundUser){
            console.log('user already created');
            res.redirect('/duplicateUser');
        }
    });
});

app.get('/login', (req, res) => {
    res.render('../routes/login', {
        title: "Home",
        style: "/css/home.css" 
   }); 

   var userName= req.body.username;
   var password= req.body.password;
   //console.log(password);
    // Users.findOne({name: userName}, function(err, foundUser){
    //    if(err){
    //        console.log(err);
    //    }else if(!foundUser){
    //      console.log("user not found");
    //    }else if(foundUser){
    //     console.log(foundUser);
    //     if(password===foundUser.password){
    //         console.log('password matches')
    //         //res.redirect('/../routes/lists');
    //     }
      //}
   //});
});

app.post('/loginUser', (req, res) => {
    var userName= req.body.username;
    var password= req.body.password;

    console.log(userName +'/n'+password); 

     Users.findOne({username: userName}, function(err, foundUser){
        if(err){
            console.log(err);
        }else if(!foundUser){
          console.log("user not found");
        }else if(foundUser){
            console.log(foundUser.password);
            if(password===foundUser.password){
                //var list = foundUser.lists.length();
                if(!foundUser.lists.name){
                    res.render('../routes/lists', {
                        title: "Task Manager", 
                        style: "/css/home.css", 
                        date: date.date, 
                        time: date.time, 
                        ampm: date.isAmOrPm,
                        name: foundUser.name,
                        username: foundUser.username,
                        lists: foundUser.lists
                    });
                }
            } else{
                console.log('passwords don\'t match');
            }
        }
    });
});

//task lists
app.get("/lists", (req , res) => {

    Users.find({user: username}, function(err, foundUser){
        res.render('../routes/lists', {
            title: "Task Manager", 
            style: "/css/home.css", 
            date: date.date, 
            time: date.time, 
            ampm: date.isAmOrPm, 
            lists: foundUser.lists
        });
    });

});

app.post('/lists', (req, res) => {
    var newList = req.body.newList;
    var userName = req.body.username;

    // var addList = new lists(newList);
    // addList.listname = newList;

    var newListObj = {
        listname: newList,
        taskItems: []
    }

    //console.log(username);
    
    Users.findOneAndUpdate({username: userName}, {"$set": {"userObjects.list": newListObj}}, function(err, foundUser){
        
        // foundUser.set(newListObj, function (err, res){
        //     if(err){
        //         console.log(err);
        //     }
        // });

        // foundUser.list =  {
        //     name: newList,
        //     tasksItems: []
        // }

        // console.log(foundUser.list);

        res.render('../routes/lists', {
            title: "Task Manager", 
            style: "/css/home.css", 
            date: date.date, 
            time: date.time, 
            ampm: date.isAmOrPm,
            name: foundUser.name,
            username: foundUser.username,
            lists: foundUser.lists,
        });
    //     if(err){
    //         console.log(err);
    //     }else if(!customList){
    //         var addList = new Lists({
    //             name: newList,
    //             tasksItems: []
    //         });
    //         addList.save();
    //         res.redirect("/lists")
    //     } else if(customList){
    //        res.redirect('/duplicatedList')
    //     }
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

    // Lists.findOne({name: customName}, function(err, customList){
    //     if(err){
    //         console.log(err)
    //     }

    //     res.render('../routes/list', {
    //             title: customName,
    //             style: "/css/home.css",
    //             date: date.date, 
    //             time: date.time, 
    //             ampm: date.isAmOrPm, 
    //             listname: customName,
    //             listName: customName, 
    //             tasks: customList.tasksItems
    //         });
    // });
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