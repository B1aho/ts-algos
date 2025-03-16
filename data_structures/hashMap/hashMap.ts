// Настоящие тесты добавить!

// Реализую аналог Map в JS. хэш таблица на основе массива связных списков. Также существует отдельно
// Двусвязный список благодаря которому при переборе значение в hashMap (встрою итератор), они будут
// перебираться в порядке добавления, перебираться будет этот двусвязный список. А ключами может быть все, что
// угодно.
import { IHashMapNode, IHashMap, Key } from "./types";
import { fnv1aHash } from "./hashCode";

class HashMapNode<K extends Key, V> implements IHashMapNode<K, V> {
    prevOrder: IHashMapNode<K, V> | null;
    nextOrder: IHashMapNode<K, V> | null;
    nextInBucket: IHashMapNode<K, V> | null;
    key: K;
    value: V;
    constructor(key: K, value: V, prevOrder = null, nextOrder = null, nextInBucket = null) {
        this.key = key;
        this.value = value;
        this.prevOrder = prevOrder;
        this.nextOrder = nextOrder;
        this.nextInBucket = nextInBucket;
    }
}

class HashMap<K extends Key, V> implements IHashMap<K, V> {
    capacity: number;
    loadFactor: number;
    limit: number = 0;
    Map: IHashMapNode<K, V>[];
    #length = 0;
    // Double linked list (implement order)
    head = 0;
    tail = 0;
    constructor(capacity = 32, loadFactor = 0.8) {
        // Calculate the table's limit – the maximum number of elements effective to keep, presumably without collisions
        this.capacity = capacity;
        this.loadFactor = loadFactor;
        this.limit = Math.floor(this.capacity * this.loadFactor);
        // Init Map
        this.Map = new Array(this.capacity).fill(null);
    };

    // Hash-function
    hash(key: K) {
        return fnv1aHash(key) % this.capacity;
    };

    // Set new key: value entry into the table
    set(key: K, value: V) {
        // If the new element overflows the table, we expand it and rehash
        if (this.#length + 1 >= this.limit) {
            this.capacity *= 2;
            const newMap = new Array(this.capacity).fill(null);
            // rehash ...
        }
        const idx = 
    };
}