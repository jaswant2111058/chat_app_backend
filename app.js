const express = require('express');
const app = express();
require('dotenv').config();
require('./middleware/auth');
app.set("view engine", 'ejs');
const path = require("path");
const mongoose = require('mongoose');
const cors = require("cors")
const static = path.join(__dirname, "/views")



const http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
    }
});



io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('msgRecived', chat => {
        socket.broadcast.emit('msgRecived', 'NewChat');
    })
    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});



app.use((req, res, next) => {
    req.io = io;
    next();
})




mongoose.set('strictQuery', true)
mongoose.connect(process.env.DBCONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err));



app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true
    })
);
app.use(express.static(static));
app.set("view engine", "ejs");



const login = require("./routes/login")
const google = require("./routes/google")
const tweets = require("./routes/tweets")


app.use("/", login);
app.use("/", google);
app.use("/", tweets);


http.listen(process.env.PORT || '5000', () => {
    console.log(`Server started at port ${process.env.PORT || '5000'}`);
});