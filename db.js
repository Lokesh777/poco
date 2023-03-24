require("dotenv").config();

const URL = process.env.MongoDB_URL
const mongoose = require('mongoose');

const connect = () => {
    mongoose.set("strictQuery", false);

    return mongoose.connect(URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // useFindAndModify: false,
        dbname: process.env.Database,
        user: process.env.db_user,
        pass: process.env.db_password,

    })
        .then(() => {
            console.log("connection established with MongoDB database")
            const connection = mongoose.connection;
       
            connection.on('connected', () => {
                console.log("Mongoose connection established with cluster");
            })

            connection.on('disconnected', () => {
                console.log("Mongoose Disconnected!!!")
            })

            process.on("SIGINT", () => {  //this process isi used to closed the connection if we pressh the ctr+c button
                connection.close(() => {
                    console.log("mongoose connection closed on the application Timeout")
                    process.exit(0);
                })
            })

        })
        .catch((err) => {
            console.error(err.message,": database connection error");
        })

}

module.exports = connect;