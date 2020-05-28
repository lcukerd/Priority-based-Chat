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

const msgAck = (msg, type) => {
    console.log(`Message: ${msg} was detected of Type: ${type}`);
}

const startMessaging = async () => {
    let counter = 0;
    let data = fs.readFileSync(path.join(__dirname, '../commands.txt')).toString().split('\n');
    while (true) {
        await new Promise((resolve, _reject) => setTimeout(() => resolve('done'), 100));
        const msg = encrypt(data[counter++], publicKey);
        socket.emit('chat', msg, msgAck);
        if (counter === data.length) {
            counter = 0;
        }
    }
}

const receivedKey = key => {
    publicKey = key;
    console.log(`Received public key in ${socket.id}`);
    startMessaging();
}

socket.emit('register', receivedKey);