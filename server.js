const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const { userJoin, getCurrentUser } = require('./users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    //Connect user to selected room
    socket.on('joinRoom', ({ username, room }) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);


        //Welcome the user
        socket.emit('message', `Welcome ${user.username}`);

        //Broadcast when the user connects
        socket.broadcast.to(user.room).emit('message', `${user.username} has joined the room`);
    });

    //Listen for a message
    socket.on('sentMessage', (message) => {
        //Emit back to everybody
        console.log(message)
        io.emit('message', message);
    })

    //Broadcast when the user disconnects
    socket.on('disconnect', () => {
        io.emit('message', `${user.username} has left the room`);
    });
});

server.listen(5000, (req, res) => {
    console.log('server running on port 5000...');
});