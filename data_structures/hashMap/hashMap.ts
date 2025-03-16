// Implementing an analog of Map in JS. HashMap is a hash table based on an array of linked lists. 
// The key can be a string, number, or boolean. 
// Additionally, nodes have `prevOrder` and `nextOrder` properties, which logically form a doubly linked list. 
// Thanks to this design, when iterating over the hashMap (using the implemented iterator), 
// the iteration will follow the insertion order (traversing the doubly linked list).

import { IHashMapNode, IHashMap, Key, HashNodeNullable } from "./types";
import { fnv1aHash } from "./hashCode";

const LOAD_FACTOR = 0.8;
const CAPACITY = 32;

// prevOrder, nextOrder - doubly lined list
// nextInBucket - single linked list in a bucket
class HashMapNode<K extends Key, V> implements IHashMapNode<K, V> {
    prevOrder: HashNodeNullable<K, V>;
    nextOrder: HashNodeNullable<K, V>;
    nextInBucket: HashNodeNullable<K, V>;
    key: K;
    value: V;
    constructor(
        key: K,
        value: V,
        prevOrder: HashNodeNullable<K, V> = null,
        nextOrder: HashNodeNullable<K, V> = null,
        nextInBucket: HashNodeNullable<K, V> = null
    ) {
        this.key = key;
        this.value = value;
        this.prevOrder = prevOrder;
        this.nextOrder = nextOrder;
        this.nextInBucket = nextInBucket;
    };
}

export class HashMap<K extends Key, V> implements IHashMap<K, V> {
    capacity: number;
    loadFactor: number;
    limit: number = 0;
    #Map: HashNodeNullable<K, V>[];
    #length = 0;
    // Pointer to the head and tail of doubly linked list
    head: HashNodeNullable<K, V> = null;
    tail: HashNodeNullable<K, V> = null;
    constructor(capacity = CAPACITY, loadFactor = LOAD_FACTOR) {
        // Calculate the table's limit – the maximum number of elements effective to keep, presumably without collisions
        this.capacity = capacity;
        this.loadFactor = loadFactor;
        this.limit = Math.floor(this.capacity * this.loadFactor);
        // Init Map
        this.#Map = new Array(this.capacity).fill(null);
    };

    // Hash-function
    hash(key: K) {
        return fnv1aHash(key) % this.capacity;
    };

    #rehash(newMap: HashNodeNullable<K, V>[]) {
        // Iterate over all nodes in the old table
        for (let node of this.#Map) {
            while (node) {
                const newIdx = this.hash(node.key);
                // Save a reference to the next node in the old chain to avoid losing it
                const nextNode = node.nextInBucket;

                // Insert the node at the head of the bucket list in the new table
                node.nextInBucket = newMap[newIdx];
                newMap[newIdx] = node;

                node = nextNode;
            }
        }
        this.#Map.fill(null);
        this.#Map = newMap;
    }

    // Set new key: value entry into the table
    set(key: K, value: V) {
        const idx = this.hash(key);
        if (idx < 0 || idx > this.capacity) {
            throw new Error("Wrong hash: Trying to access index out of bounds");
        }

        let target: HashNodeNullable<K, V> = this.#Map[idx];
        // If there is no items in the bucket
        if (!target) {
            // Add new node to the bucket
            const newNode = new HashMapNode(key, value, this.tail)
            this.#Map[idx] = newNode;
            // Update the doubly linked list
            if (!this.head) this.head = newNode;
            if (this.tail) this.tail.nextOrder = newNode;
            this.tail = newNode;

            this.#length++;
        } else {
            // Search in the singly linked list of the bucket
            while (target.key !== key && target.nextInBucket) {
                target = target.nextInBucket;
            }
            if (target.key === key) target.value = value;
            else {
                const newNode = new HashMapNode(key, value, this.tail);
                target.nextInBucket = newNode;

                // Update the doubly linked list
                if (this.tail) this.tail.nextOrder = newNode;
                this.tail = newNode;

                this.#length++;
            }
        }
        // If table full loaded, we expand it and rehash
        if (this.#length > this.limit) {
            this.capacity *= 2;
            this.limit = Math.floor(this.capacity * this.loadFactor);
            const newMap = new Array(this.capacity).fill(null);
            this.#rehash(newMap);
        }
        return this.#Map;
    };

    // Get value by key
    get(key: K) {
        const idx = this.hash(key);
        let node = this.#Map[idx];
        while (node) {
            if (node.key === key)
                return node.value;
            node = node.nextInBucket
        }
        return null;
    };

    // Removes a node while maintaining connections in the singly linked bucket list 
    // and the doubly linked insertion order list
    // prevNode - the previous node in the singly linked bucket list
    #removeHelper(
        prevNode: number | IHashMapNode<K, V>,
        removeNode: IHashMapNode<K, V>,
    ) {
        // If the node to be removed is the head of the singly linked bucket list
        if (typeof prevNode === "number") {
            this.#Map[prevNode] = removeNode.nextInBucket;
        } else {
            prevNode.nextInBucket = removeNode.nextInBucket;
        }

        // Maintain the order of the doubly linked list
        if (this.tail === removeNode) this.tail = removeNode.prevOrder;
        if (this.head === removeNode) this.head = removeNode.nextOrder;
        if (removeNode.nextOrder && removeNode.prevOrder) {
            removeNode.prevOrder.nextOrder = removeNode.nextOrder;
        }
        // Clear the node to prevent memory leaks
        removeNode.prevOrder = null;
        removeNode.nextOrder = null;
        removeNode.nextInBucket = null;

        this.#length--;
        return true;
    };

    // Remove entry by key
    remove(key: K) {
        const idx = this.hash(key);
        let node = this.#Map[idx];
        if (!node) return false;
        // If the node to be removed is at the beginning of the bucket list
        if (node.key === key) {
            return this.#removeHelper(idx, node);
        } else {
            // Go through the linked list in the bucket to find the previous node of the one being removed
            while (node.nextInBucket) {
                if (node.nextInBucket.key === key) {
                    let removeNode = node.nextInBucket;
                    return this.#removeHelper(node, removeNode);
                }
            }
        }
        return false;
    };

    // The keys, values, and entries methods can be implemented as generators for lazy iteration
    keys() {
        const keys: K[] = [];
        for (const node of this) {
            keys.push(node.key);
        }
        return keys;
    };

    values() {
        const values: V[] = [];
        for (const node of this) {
            values.push(node.value);
        }
        return values;
    };

    entries() {
        const entries: [K, V][] = [];
        for (const node of this) {
            entries.push([node.key, node.value]);
        }
        return entries;
    };

    has(key: K) {
        return this.get(key) !== null;
    }

    length() {
        return this.#length;
    };

    // Cleare the hash table
    clear(isDeep = false) {
        // If table contain complex objects, then clear them too
        if (isDeep) {
            this.#Map.forEach((node, idx) => {
                let currentNode = node;
                while (currentNode) {
                    const nextNode = currentNode.nextInBucket;
                    currentNode.nextInBucket = null;
                    currentNode = nextNode;
                }
            });
        }
        this.#Map.fill(null);
        this.tail = null;
        this.head = null;
        this.#length = 0;
    };

    // Generator that produce iterator - make hash table iterable 
    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
            yield node;
            node = node.nextOrder;
        }
    };
}