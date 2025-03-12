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


    size() {
        if (this.#head === null || this.#tail === null)
            return 0;
        let total = 1;
        let ptr: IListNode | null = this.#head
        while (ptr && ptr !== this.#tail) {
            ptr = ptr.next;
            total++
        }
        return total;
    }

    append(val: string) {
        const node = new ListNode(val);
        if (this.#head === null || this.#tail === null) {
            this.#head = node;
            this.#tail = node;
        } else {
            this.#tail.next = node;
            this.#tail = node;
        }
    };

    prepend(val: string) {
        const node = new ListNode(val);
        if (this.size() === 0) {
            this.#head = node;
            this.#tail = node;
        } else {
            node.next = this.#head;
            this.#head = node;
        }
    };

    toString() {
        if (this.#head === null)
            return "";
        let ptr: IListNode | null = this.#head;
        let resultStr = "";
        while (ptr) {
            resultStr += '( ' + ptr.value + ' )';
            ptr = ptr.next;
            if (ptr) resultStr += ' -> ';
        }
        return resultStr;
    };

    at(idx: number) {
        if (this.#head === null || idx <= 0)
            return null;
        const node = new ListNode("");
        let curr = 0;
        let ptr: IListNode | null = this.#head;
        while (ptr && curr !== idx) {
            ptr = ptr.next;
            curr++;
        }
        return ptr;
    };

    pop() {
        if (this.size() <= 0) {
            return null;
        }
        let data = null;
        if (this.#tail && this.#tail === this.#head) {
            data = this.#tail.value;
            this.#head = null;
            this.#tail = null;
            return data;
        } else {
            let ptr = this.#head as IListNode;
            while (ptr.next && ptr.next !== this.#tail)
                ptr = ptr.next;
            data = (this.#tail) ? this.#tail.value : null;
            this.#tail = ptr;
            ptr.next = null;
        }
        return data;
    }

    contains(val: string) {
        if (this.size() === 0)
            return false;
        let ptr = this.#head
        while (ptr) {
            if (ptr.value === val)
                return true;
            ptr = ptr.next;
        }
        return false;
    }

    find(val: string) {
        if (this.size() === 0)
            return null;
        let ptr = this.#head;
        let idx = 0;
        while (ptr) {
            if (ptr.value === val)
                return idx;
            ptr = ptr.next;
            idx++;
        }
        return null;
    }

    insertAt(value: string, idx: number) {
        if (idx < 0 || idx > this.size())
            return false;
        if (idx === 0) {
            this.prepend(value);
            return true
        }
        if (idx === this.size()) {
            this.append(value);
            return true;
        }
        let beforePtr: IListNode = this.#head as IListNode;
        let targetPtr: IListNode;
        targetPtr = this.at(idx) as IListNode;
        while (beforePtr.next !== targetPtr) {
            beforePtr = beforePtr.next as IListNode;
        }
        const newNode = new ListNode(value);
        beforePtr.next = newNode;
        newNode.next = targetPtr;
        return true;
    }

    removeAt(idx: number) {
        return null;
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
