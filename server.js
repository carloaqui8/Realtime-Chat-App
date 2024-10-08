const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const mongoose = require('mongoose');

const { userJoin, getCurrentUser, userLeave, getUsersByRoom } = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(__dirname));

//Connect to database
mongoose.connect("mongodb://localhost:27017/chatAppDatabase", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

//Create database record model
const Message = mongoose.model("Message", {
    username: { type: String },
    message: { type: String },
    room: { type: String }
});

io.on('connection', (socket) => {
    //Connect user to selected room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        //Join the user to the room
        socket.join(user.room);

        //Welcome the user (only seen by user)
        socket.emit('serverMessage', `Welcome ${user.username}`);

        //Broadcast when the user connects
        socket.broadcast.to(user.room).emit('serverMessage', `${user.username} has joined the room`);

        //Modify room name and users info
        io.to(user.room).emit('roomInfo', {
            room: user.room,
            users: getUsersByRoom(user.room)
        })
    });

    //Listen for a message
    socket.on('sentMessage', (message) => {
        const user = getCurrentUser(socket.id);
        const messageRecord = new Message({
            username: user.username,
            message: message,
            room: user.room
        });
        messageRecord.save();

        //Emit back to everyone in current room
        console.log(message)
        io.to(user.room).emit('message', message);
    })

    //Broadcast to room when the user disconnects
    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if (user) {
            //Broadcast to room when user leaves
            io.to(user.room).emit('serverMessage', `${user.username} has left the room`);

            //Modify room name and users info
            io.to(user.room).emit('roomInfo', {
                room: user.room,
                users: getUsersByRoom(user.room)
            })
        }
    });
});

server.listen(5000, (req, res) => {
    console.log('server running on port 5000...');
});