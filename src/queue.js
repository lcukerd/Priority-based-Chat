class PriorityQueue {
    constructor() {
        this.items = []
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
    }

    dequeue() {
        if (this.isEmpty())
            return undefined;
        const item = this.items[0];
        this.items.shift();
        return item;
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

module.exports = PriorityQueue;