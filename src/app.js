const date = require('../modules/date');
const express = require("express");
const app = express();

app.set("view engine", "ejs");



app.get("/", (req , res) => {
    res.render('../routes/index', {title: "Home", date: date.date, time: date.time, ampm: date.isAmOrPm});
});

app.listen(3000);