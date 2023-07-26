//entry point

const express = require("express");
const dotenv = require("dotenv");
const connectDatabase = require("./helpers/database/connectDatabase")
const routers = require("./routers/index");
const customErrorHandler = require("./middlewares/errors/customErrorHandler");

//Environment Variables
dotenv.config({
    path: "./config/env/config.env"
});

//MongoDb Connection

connectDatabase();



const app = express();

//Express - Body Middleware
app.use(express.json());

const PORT = process.env.PORT;


//Routers Middleware

app.use("/api", routers); //index.js ana dosya olduğundan ona bakacak

//Error Handler

app.use(customErrorHandler);

app.listen(PORT,() => {
    console.log(`App Started on ${PORT} : ${process.env.NODE_ENV}`);
})

