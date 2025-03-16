// Настоящие тесты добавить!

// Реализую аналог Map в JS. хэш таблица на основе массива связных списков. Также существует отдельно
// Двусвязный список благодаря которому при переборе значение в hashMap (встрою итератор), они будут
// перебираться в порядке добавления, перебираться будет этот двусвязный список. А ключами может быть все, что
// угодно.
import { IHashMapNode, IHashMap, Key } from "./types";

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

class HashMap<K extends Key, V> implements IHashMap<Key, V> {

}