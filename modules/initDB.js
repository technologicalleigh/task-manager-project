const { connect, connection } = require('mongoose');
const { config } = require('dotenv'); 

module.exports = () => {
 config(); //invoking the dotenv config here
 const uri = process.env.DB_CONNECT;

 connect(uri, {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    })
        .then(() => {
            console.log('Connection estabislished with MongoDB');
        })
        .catch(error => console.error(error.message));
}

//mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true,
// useUnifiedTopology: true,
// useFindAndModify: false,
// useCreateIndex: true }, () => {
// console.log("Connected to db!");
// app.listen(3000, () => console.log("Server Up and running"));
// });