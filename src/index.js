const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const crypto = require('crypto');
const PriorityQueue = require('./queue.js');
const port = process.env.PORT || 5000;

app.listen(port);

let mapKey = {};

let queue = new PriorityQueue();

function handler(req, res) {
    res.end('Server running!')
}

const decrypt = (data, key) => {
    const buffer = Buffer.from(data, 'base64')
    const decrypted = crypto.privateDecrypt({
        key: key,
        passphrase: '',
    },
        buffer,
    )
    return decrypted.toString('utf8')
}

const generateKeys = () => {
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: '',
        },
    })
    return { privateKey, publicKey };
}

io.on('connection', socket => {
    console.log('Got a new connection');
    // Create a unique for every new connection.
    // Share public Key with client 
    // and keep the private key in server mapped to the socket's ID
    socket.on('register', ack => {
        console.log(`Registering Client ${socket.id}`);
        const key = generateKeys();
        mapKey[socket.id] = key.privateKey;
        ack(key.publicKey);
        console.log('Registered')
    });

    // Decrypt the message using the private key of that socket
    // Queue the message in command queue or msg queue depending on its format
    socket.on('chat', (msg, ack) => {
        const key = mapKey[socket.id];
        const message = decrypt(msg.message, key);
        let item = {
            message,
            priority: msg.priority,
            ack
        }

        if (message.charAt(0) === '$') item['type'] = 'cmd';
        else item['type'] = 'msg';

        queue.enqueue(item);
    });
})