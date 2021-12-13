const date = require('../modules/date');
const express = require("express");
const bodyParser= require('body-parser') 
const app = express();
app.use(bodyParser.urlencoded({extended: true}))
//The urlencoded method within body-parser tells body-parser to extract data from the <form> element and add them to the body property in the request object.

app.set("view engine", "ejs");



app.get("/", (req , res) => {
    res.render('../routes/index', {title: "Home", date: date.date, time: date.time, ampm: date.isAmOrPm});
});

app.listen(3000);