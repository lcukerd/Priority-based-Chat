import io from 'socket.io-client';

socket = io();

socket.on('connect', () => {
    socket.on('register')
});