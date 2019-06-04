
require('dotenv').load();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
//const formData = require('express-form-data');
const cors = require('cors');

//Database Configuration
require('./src/models/db');


const indexRouter = require('./src/routes');
const app = express();

http = require('http');
server = http.createServer(app);



app.disable('x-powered-by');//turn off header
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(compression());
app.use(logger('dev'));
app.use(express.json({extended: true}));
app.use(express.urlencoded({extended: true}));
//app.use(formData.parse({}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.options('*', cors());
app.use('/', indexRouter);

io = require('socket.io').listen(server);
io.on('connection', (socket) => {

    console.log('user connected')
    socket.on('join', function(userNickname = "awele") {

        console.log(userNickname +" : has joined the chat "  );
        socket.broadcast.emit('userjoinedthechat',userNickname +" : has joined the chat ");
    })
    
    socket.on('messagedetection', (senderNickname="spunkalator", messageContent) => {
    
        //log the message in console 
        console.log(senderNickname+" : " +messageContent)
        //create a message object 
        let  message = {"message":messageContent, "senderNickname":senderNickname}
        // send the message to all users including the sender  using io.emit() 
        io.emit('message', message )
    })
    
    socket.on('disconnect', function() {
    
            console.log(userNickname +' has left ')
            socket.broadcast.emit( "userdisconnect" ,' user has left');

    });
});



//Enable CORS from client side
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT,GET,DELETE,POST,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With,Content-Type, Accept, Authorization, Apptoken,' +
        ' Access-Control-Allow-Credential');
    res.header('Access-Control-Allow-Credentials', 'true');

    next();
});


/**
 * Api routing section
 */
require('./src/routes/api')(app);


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// Catch unauthorised errors
// app.use(function (err, req, res, next) {
//     if (err.name === 'UnauthorizedError') {
//         res.status(401);
//         res.json({"message": err.name + ": " + err.message});
//     }else{
//        throw new Error(err);
//     }
// });

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
