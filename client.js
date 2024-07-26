const socket = io();
const messageForm = document.getElementById('messageForm');

socket.on('message', (message) => {
    console.log(message);
});

//On message submission
messageForm.addEventListener('submit', (event) => {
    //Don't open new tab or whatever
    event.preventDefault();

    //Take the message the user typed in
    const message = event.target.elements.message.value;

    //Send it to the server
    socket.emit('sentMessage', message);
});