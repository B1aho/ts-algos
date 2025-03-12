interface IListNode {
    next: IListNode | null;
    value: string;
}

class ListNode implements IListNode {
    next: IListNode | null = null;
    value: string = "";

    constructor(value: string) {
        this.value = value;
    }
}

interface ILinkedList {
    append: (val: string) => void;
    prepend: (val: string) => void;
    size: () => number;
    at: (idx: number) => IListNode | null;
    pop: () => string | null;
    contains: (val: string) => boolean;
    find: (val: string) => number | null;
    toString: () => string;
    insertAt: (value: string, idx: number) => boolean;
    removeAt: (idx: number) => string | null;
}

class LinkedList implements ILinkedList {
    #head: IListNode | null = null;
    #tail: IListNode | null = null;
    #length: number = 0;

    size() {
        return this.#length;
    };

    append(val: string) {
        const node = new ListNode(val);
        if (!this.#head || !this.#tail) {
            this.#head = node;
            this.#tail = node;
        } else {
            this.#tail.next = node;
            this.#tail = node;
        }
        this.#length++;
    };

    prepend(val: string) {
        const node = new ListNode(val);
        if (this.#length === 0) {
            this.#head = node;
            this.#tail = node;
        } else {
            node.next = this.#head;
            this.#head = node;
        }
        this.#length++;
    };

    toString() {
        if (this.#head === null) return "";
        let node: IListNode | null = this.#head;
        let resultStr = "";
        while (node) {
            resultStr += `( ${node.value} ) -> `;
            node = node.next;
        }
        return resultStr + 'null';
    };

    at(idx: number) {
        if (this.#head === null || idx < 0)
            return null;
        let curr = 0;
        let node: IListNode | null = this.#head;
        while (node && curr < idx) {
            node = node.next;
            curr++;
        }
        return node;
    };

    pop() {
        if (this.#length <= 0 || !this.#head) return null;
        let data: string;
        if (this.#tail && this.#tail === this.#head) {
            data = this.#tail.value;
            this.#head = null;
            this.#tail = null;
        } else {
            let node = this.#head;
            while (node.next && node.next !== this.#tail)
                node = node.next;
            data = (this.#tail) ? this.#tail.value : "";
            this.#tail = node;
            this.#tail.next = null;
        }
        this.#length--;
        return data;
    }

    contains(val: string) {
        if (this.size() === 0)
            return false;
        let node = this.#head
        while (node) {
            if (node.value === val)
                return true;
            node = node.next;
        }
        return false;
    }

    find(val: string) {
        if (this.size() === 0)
            return null;
        let node = this.#head;
        let idx = 0;
        while (node) {
            if (node.value === val)
                return idx;
            node = node.next;
            idx++;
        }
        return null;
    }

    insertAt(value: string, idx: number) {
        if (idx < 0 || idx > this.size() || !this.#head) return false;
        if (idx === 0) {
            this.prepend(value);
            return true
        }
        if (idx === this.size()) {
            this.append(value);
            return true;
        }
        const newNode = new ListNode(value);
        let beforeNode = this.at(idx - 1);

        if (!beforeNode) return false;

        newNode.next = beforeNode.next;
        beforeNode.next = newNode;
        this.#length++;
        return true;
    }

    removeAt(idx: number) {
        if (this.#length === 0 || idx < 0 || idx >= this.#length) return null;
        if (idx + 1 === this.#length) return this.pop();
        let value = "";
        if (idx === 0 && this.#head) {
            const newHead = this.#head.next;
            this.#head.next = null;
            value = this.#head.value;
            this.#head = newHead;
            this.#length--;
            return value;
        }
        let beforeNode = this.at(idx - 1);
        if (!beforeNode || !beforeNode.next) return null;
        let targetNode = beforeNode.next;
        beforeNode.next = targetNode.next;
        targetNode.next = null;
        value = targetNode.value;
        this.#length--;

        return value;
    };
};

// example uses class syntax - adjust as necessary
const list = new LinkedList();

list.append("dog");
list.append("cat");
list.append("parrot");
list.append("hamster");
list.append("snake");
list.append("turtle");
list.prepend("monkey");
console.log(list.toString());
console.log('cat idx:', list.find("cat"));
console.log(list.size());
console.log(list.pop());
console.log(list.pop());
console.log(list.pop());
console.log(list.toString());
console.log(list.size());
console.log('Contains parrot:', list.contains('parrot'));
console.log('Dog index:', list.find("dog"));
list.insertAt('bull', 2);
console.log(list.toString());
list.removeAt(1);
console.log(list.toString());
