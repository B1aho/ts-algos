import { IListNode, ILinkedList } from "./types";

// This class represent node of singly linked list
class ListNode implements IListNode {
    next: IListNode | null = null;
    value: string = "";

    constructor(value: string) {
        this.value = value;
    }
}

// This class represent singly linked list
export class LinkedList implements ILinkedList {
    #head: IListNode | null = null;
    #tail: IListNode | null = null;
    #length: number = 0;

    size() {
        return this.#length;
    };

    // Add to the end of the list
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

    // Add to the beginning of the list
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

    // Represent list as a string: ( val ) -> ( val ) -> ( val ) -> null 
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

    // Get the node by index
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

    // Remove the node from the end of the list
    pop() {
        if (this.#length <= 0 || !this.#head) return null;
        let data: string;
        if (this.#tail && this.#length === 1) {
            data = this.#tail.value;
            this.#head = null;
            this.#tail = null;
        } else {
            let node = this.#head;
            // Find the second-to-last node 
            while (node.next && node.next !== this.#tail)
                node = node.next;
            data = (this.#tail) ? this.#tail.value : "";
            this.#tail = node;
            this.#tail.next = null;
        }
        this.#length--;
        return data;
    }

    // Check if list contain value
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

    // Get the index of the node with a value equivalent to the given one
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

    // Insert the node in specific index position 
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
        // To insert a node at a specific index:
        // Connect the inserted node to its following node
        // and connect the preceding node to the inserted node
        const newNode = new ListNode(value);
        let beforeNode = this.at(idx - 1);

        if (!beforeNode) return false;

        newNode.next = beforeNode.next;
        beforeNode.next = newNode;
        this.#length++;
        return true;
    }

    // Remove the node from specific index position 
    removeAt(idx: number) {
        // Non-valid index
        if (this.#length === 0 || idx < 0 || idx >= this.#length) return null;
        // Remove tail node
        if (idx + 1 === this.#length) return this.pop();
        let value = "";
        // Remove head node
        if (idx === 0 && this.#head) {
            const newHead = this.#head.next;
            this.#head.next = null;
            value = this.#head.value;
            this.#head = newHead;
            this.#length--;
            return value;
        }
        // To delete a node at a specific index:
        // connect the node before it to the node following it, 
        // and then set its 'next' field to null
        let beforeNode = this.at(idx - 1);
        if (!beforeNode || !beforeNode.next) return null;
        let targetNode = beforeNode.next;
        beforeNode.next = targetNode.next;
        targetNode.next = null;
        value = targetNode.value;
        this.#length--;

        return value;
    };

    // Define list iterator. Use cases: 
    // allow iteration through for..of 
    // and support standart method for ierable collections (map, filter, ..)
    *[Symbol.iterator](): IterableIterator<IListNode> {
        let currentNode = this.#head;
        while (currentNode) {
            yield currentNode;
            currentNode = currentNode.next;
        }
    }
};
