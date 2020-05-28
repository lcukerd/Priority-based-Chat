const io = require('socket.io-client');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto')

socket = io.connect('http://localhost:5000');

let publicKey;

const encrypt = (data, key) => {
    const buffer = Buffer.from(data, 'utf8')
    const encrypted = crypto.publicEncrypt(key, buffer)
    return encrypted.toString('base64')
}

// Recieve acknowledgement from server with the detected type of msg
const msgAck = (msg, priority, result) => {
    console.log(`Message: ${msg} Priority: ${priority} Output: ${result}`);
}
const randomNumber = length => {
    return Math.floor(Math.random() * length);
}
// Use the stored public key to encrypt messages before sending
const startMessaging = async () => {
    let data = fs.readFileSync(path.join(__dirname, '../commands.txt')).toString().split('\n');
    while (true) {
        // Timeout to ensure that client don't hang CPU
        await new Promise((resolve, _reject) => setTimeout(() => resolve('done'), 100));
        let msg = {};
        msg.message = encrypt(data[randomNumber(data.length)], publicKey);
        msg.priority = Math.floor(Math.random() * 10);

        socket.emit('chat', msg, msgAck);
    }
}

// Store the public key
const receivedKey = key => {
    publicKey = key;
    console.log(`Received public key in ${socket.id}`);
    startMessaging();
}

// Register this client with server and grab the public key
socket.emit('register', receivedKey);