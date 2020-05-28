const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const NodeRSA = require('node-rsa');
const port = process.env.PORT || 5000;

app.listen(80);

let mapKey = {};

let msgqueue = [];
let cmdqueue = [];

io.on('connection', socket => {
    console.log('Got a new connection');

    io.emit('this', { will: 'be recieved by everyone' });

    socket.on('register', (msg, ack) => {
        const key = msg.key;
        console.log(`Registering Client ${socket.id}`);
        mapKey[socket.id] = key;
        console.log('Registered')
        ack();
    });

    socket.on('chat', (msg, ack) => {
        const key = mapKey[socket.id]
        const message = key.decrypt(msg.message)
        if (message.charAt(0) === '$') {
            cmdqueue.push(message.replace('$ '));
            ack('Command');
        } else {
            msgqueue.push(message);
            ack('Message');
        }
    });
})