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

    traverse(from: IListNode | null, to: IListNode | null) {
        let total = 0;
        if (from === null)
            return total;
        total++;
        while (from && to && from !== to) {
            from = from.next;
            total++
        }
        return total;
    }

    size() {
        return this.traverse(this.#head, this.#tail);
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
        if (this.#head === null) {
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

    at: (idx: number) => IListNode | null;
    pop: () => string | null;
    contains: (val: string) => boolean;
    find: (val: string) => number | null;
    insertAt: (value: string, idx: number) => boolean;
    removeAt: (idx: number) => string | null;
};

