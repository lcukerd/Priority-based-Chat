# Priority-based-Chat

An Implementation of Chat Server and clients using websockets. Demonstrates exchanging text messages as well as running system commands on the server machine (tested on Mac).
<br/>
The message are executed on the basis of its priority.
<br/>
The messages are encrypted with RSA to ensure that the socket stream is secure.

### File structure:
* clientRunner.js: Executes and starts 20 instances on client at once.
* src/client.js: The whole logic of client side. Picks message from commands.txt and pushes it to server.
* src/index.js: The logic for server side. Handles all incoming connection and messages and pushes them in queue.
* src/queue.js: The logic for priority queue. Sorts all messages pushed in queue based on priority and also executes these messages.
* commands.txt: Text file containing list of commands for use by client.


### How to run the project locally?
After cloning the repo and moving into the repo directory, perform below steps (Assuming node, npm and nvm are correctly installed):
* Make sure you are using node version `12.7.0`: `nvm use 12.7.0`
* Install all npm dependencies `npm install` 
* Run the server using `node src/index.js`
* Run 20 instances of client using `node clientRunner.js`

### Dependencies:
* Socket.io: Used to handle socket connections: https://socket.io/


