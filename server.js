const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    //Welcome the user
    socket.emit('message', 'Welcome __!');
    
    //Broadcast when the user connects
    socket.broadcast.emit('message', "__ has joined the room");

    //Also broadcast when the user disconnects
    socket.on('disconnect', () => {
        io.emit('message', '__ has left the room');
    });

    //Listen for a message
    socket.on('sentMessage', (message) => {
        //Emit back to everybody
        console.log(message)
        io.emit('message', message);
    })
});

server.listen(5000, (req, res) => {
    console.log('server running on port 5000...');
});