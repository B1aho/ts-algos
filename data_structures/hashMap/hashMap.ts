// Настоящие тесты добавить!

// Реализую аналог Map в JS. хэш таблица на основе массива связных списков. Также существует отдельно
// Двусвязный список благодаря которому при переборе значение в hashMap (встрою итератор), они будут
// перебираться в порядке добавления, перебираться будет этот двусвязный список. А ключами может быть все, что
// угодно.
import { IHashMapNode, IHashMap, Key, HashNodeNullable } from "./types";
import { fnv1aHash } from "./hashCode";

// Добавить комментарий, что ссылки prevOrder nextOrder логически образуют двусвязный список - для соблюдения порядка
// А nextInBucket образует односвязный список конкретной корзины
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

class HashMap<K extends Key, V> implements IHashMap<K, V> {
    capacity: number;
    loadFactor: number;
    limit: number = 0;
    Map: HashNodeNullable<K, V>[];
    #length = 0;
    // Double linked list (implement order)
    head: HashNodeNullable<K, V> = null;
    tail: HashNodeNullable<K, V> = null;
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

    #rehash(newMap: HashNodeNullable<K, V>[]) {
        // Проходим по всем узлам старой таблицы
        for (let node of this.Map) {
            while (node) {
                // Вычисляем новый индекс с помощью хеш-функции
                const newIdx = this.hash(node.key);
                // Сохраняем ссылку на следующий узел в старой цепочке, чтобы не потерять её
                const nextNode = node.nextInBucket;

                // Вствляем узел в голову списка корзины в новой таблице
                node.nextInBucket = newMap[newIdx];
                newMap[newIdx] = node;

                node = nextNode;
            }
        }
        this.Map.fill(null);
        this.Map = newMap;
    }

    // Set new key: value entry into the table
    set(key: K, value: V) {
        // If the new element overflows the table, we expand it and rehash
        if (this.#length + 1 >= this.limit) {
            this.capacity *= 2;
            this.limit = Math.floor(this.capacity * this.loadFactor);
            const newMap = new Array(this.capacity).fill(null);
            this.#rehash(newMap);
        }

        const idx = this.hash(key);
        if (idx < 0 || idx >= this.#length) {
            throw new Error("Wrong hash: Trying to access index out of bounds");
        }

        let target: HashNodeNullable<K, V> = this.Map[idx];
        // Если нет коллизии
        if (!target) {
            // Добавляем новый узел
            const newNode = new HashMapNode(key, value, this.tail)
            this.Map[idx] = newNode;
            // обновляем двусвязный список
            if (!this.head) this.head = newNode;
            if (this.tail) this.tail.nextOrder = newNode;
            this.tail = newNode;

            this.#length++;
        } else {
            // Поиск в связном списке корзины
            while (target.key !== key && target.nextInBucket) {
                target = target.nextInBucket;
            }
            if (target.key === key) target.value = value;
            else {
                const newNode = new HashMapNode(key, value, this.tail);
                target.nextInBucket = newNode;

                // Обновляем двусвязный список
                if (this.tail) this.tail.nextOrder = newNode;
                this.tail = newNode;

                this.#length++;
            }
        }
        return this.Map;
    };

    // Get value by key
    get(key: K) {
        const idx = this.hash(key);
        let node = this.Map[idx];
        while (node) {
            if (node.key === key)
                return node.value;
            node = node.nextInBucket
        }
        return null;
    };

    // Удаляет узел соблюдая связи в односвязном списке корзины и двусвязном списке порядка добавления
    // prevNode - предыдущий список в односвязном списке корзины
    #removeHelper(
        prevNode: number | IHashMapNode<K, V>,
        removeNode: IHashMapNode<K, V>,
    ) {
        // Если удаляемый узел - это голова односвязного списка корзины
        if (typeof prevNode === "number") {
            this.Map[prevNode] = removeNode.nextInBucket;
        } else {
            prevNode.nextInBucket = removeNode.nextInBucket;
        }

        // Сохраняем порядок двусвязного списка
        if (this.tail === removeNode) this.tail = removeNode.prevOrder;
        if (this.head === removeNode) this.head = removeNode.nextOrder;
        if (removeNode.nextOrder && removeNode.prevOrder) {
            removeNode.prevOrder.nextOrder = removeNode.nextOrder;
        }
        // Очищаем узел, чтобы избежать утечек памяти 
        removeNode.prevOrder = null;
        removeNode.nextOrder = null;
        removeNode.nextInBucket = null;

        this.#length--;
        return true;
    };

    remove(key: K) {
        const idx = this.hash(key);
        let node = this.Map[idx];
        if (!node) return false;
        // Если удаляемый узел в начале списка корзины
        if (node.key === key) {
            return this.#removeHelper(idx, node);
        } else {
            // Пробегаем по связному списку в корзине, чтобы найти предыдущий узел удаляемого узла
            while (node.nextInBucket) {
                if (node.nextInBucket.key === key) {
                    let removeNode = node.nextInBucket;
                    return this.#removeHelper(node, removeNode);
                }
            }
        }
        return false;
    };

    // Можно реализовать как генератор для ленивой итерации
    keys() {
        const keys: K[] = [];
        for (const node of this) {
            keys.push(node.key);
        }
        return keys;
    };

    // Можно реализовать как генератор для ленивой итерации
    values() {
        const values: V[] = [];
        for (const node of this) {
            values.push(node.value);
        }
        return values;
    };

    // Можно реализовать как генератор для ленивой итерации
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

    clear(isDeep = false) {
        if (isDeep) {
            this.Map.forEach((node, idx) => {
                let currentNode = node;
                while (currentNode) {
                    const nextNode = currentNode.nextInBucket;
                    currentNode.nextInBucket = null;
                    currentNode = nextNode;
                }
            });
        }
        this.Map.fill(null);
        this.tail = null;
        this.head = null;
        this.#length = 0;
    };

    *[Symbol.iterator]() {
        let node = this.head;
        while (node) {
            yield node;
            node = node.nextOrder;
        }
    };
}