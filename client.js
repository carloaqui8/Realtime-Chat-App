const socket = io();
const messageForm = document.getElementById('messageForm');
const messageHistory = document.getElementById('messageHistory');
let currentMsg = '';

const roomNameDisplay = document.getElementById('roomName');
const usersDisplay = document.getElementById('usersList');

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true
});

//Join specific chatroom
socket.emit('joinRoom', { username, room });
                    // console.log(username, room);

socket.on('roomInfo', ({ room, users }) => {
    //Change Room Name
    roomNameDisplay.innerText = `${room}`;

    //Change Users List
    usersDisplay.innerHTML = `
        ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
});

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

socket.on('serverMessage', (msg) => {
    //Create new message element
    const newMessage = document.createElement("p");
    newMessage.textContent = msg;

    newMessage.classList.add('serverMessage');

    //Add to the message history
    messageHistory.appendChild(newMessage);
});