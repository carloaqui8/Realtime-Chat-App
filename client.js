const socket = io();
const messageForm = document.getElementById('messageForm');
const messageHistory = document.getElementById('messageHistory');
let currentMsg = '';

//On message submission
messageForm.addEventListener('submit', (event) => {
    //Don't open new tab or whatever
    event.preventDefault();

    //Take the message the user typed in
    const message = event.target.elements.message.value;
    currentMsg = message;

    //Send it to the server
    socket.emit('sentMessage', message);
});

socket.on('message', (msg) => {
    //Create new message element
    const newMessage = document.createElement("p");
    newMessage.textContent = msg;

    // If submit came from self, make myMessage
    // Else make yourMessage
    if (msg == currentMsg) {
        newMessage.classList.add('myMessage')
    }
    else {
        newMessage.classList.add('yourMessage')
    }

    //Add to the message history
    messageHistory.appendChild(newMessage);

    //Clear message form after sending
    document.getElementById('messageForm').reset();
});