const { exec } = require("child_process");

class PriorityQueue {
    constructor() {
        this.items = [];
        this.consuming = false;
    }

    enqueue(ele, priority) {
        let contain = false;
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].priority > ele.priority) {
                this.items.splice(i, 0, ele);
                contain = true;
                break;
            }
        }

        // If list is empty else if new element has highes t priority
        if (!contain) {
            this.items.push(ele);
        }
        // Only start the consuming function when not already running
        if (!this.consuming) {
            this.consuming = true;
            this.consume();
        }
    }

    dequeue() {
        return this.items.shift();
    }

    // Consume messages in this queue
    async consume() {
        let item = this.dequeue();
        while (item != undefined) {
            console.log(`Working on P${item.priority} msg`)
            if (item.type === 'cmd') {
                let cmdItem = item;
                exec(cmdItem.message.replace('$ ', ''), (error, stdout, stderr) => {
                    let output;

                    if (error) output = error.message;
                    if (stderr) output = stderr
                    if (!output) output = stdout;

                    console.log(output)
                    cmdItem.ack(cmdItem.message, cmdItem.priority, output);
                });
            } else if (item.type === 'msg') {
                console.log(item.message)
                item.ack(item.message, item.priority, item.message);
            }
            item = this.dequeue();
        }
        this.consuming = false;
    }
}

module.exports = PriorityQueue;