const app = require('http').createServer(handler)
const io = require('socket.io')(app);
const fs = require('fs');
const crypto = require('crypto')
const port = process.env.PORT || 5000;

app.listen(port);

let mapKey = {};

let msgqueue = [];
let cmdqueue = [];

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

function handler(req, res) {
    res.end('Server running!')
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

    io.emit('this', { will: 'be recieved by everyone' });

    socket.on('register', ack => {
        console.log(`Registering Client ${socket.id}`);
        const key = generateKeys();
        mapKey[socket.id] = key.privateKey;
        ack(key.publicKey);
        console.log('Registered')
    });

    socket.on('chat', (msg, ack) => {
        const key = mapKey[socket.id];
        const message = decrypt(msg, key);

        if (message.charAt(0) === '$') {
            cmdqueue.push(message.replace('$ '));
            ack(message, 'Command');
        } else {
            msgqueue.push(message);
            ack(message, 'Message');
        }

    });
})