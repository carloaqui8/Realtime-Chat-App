const http = require('http');
const express = require('express');
const path = require('path');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

app.get('/', (req, res) => {
    // res.status(200).send('<h1>Hello world</h1>')
    res.sendFile(path.join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log("A user has connected");
});


server.listen(5000, (req, res) => {
    console.log('server running on port 5000...');
});