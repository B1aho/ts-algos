// Настоящие тесты добавить!

// Реализую аналог Map в JS. хэш таблица на основе массива связных списков. Также существует отдельно
// Двусвязный список благодаря которому при переборе значение в hashMap (встрою итератор), они будут
// перебираться в порядке добавления, перебираться будет этот двусвязный список. А ключами может быть все, что
// угодно.
import { IHashMapNode, IHashMap, Key } from "./types";

class HashMapNode implements IHashMapNode {
    prevOrder: IHashMapNode | null;
    nextOrder: IHashMapNode | null;
    nextInBucket: IHashMapNode | null;
    key: Key;
    value: any;
    constructor(key: Key, value: any, prevOrder = null, nextOrder = null, nextInBucket = null) {
        this.key = key;
        this.value = value;
        this.prevOrder = prevOrder;
        this.nextOrder = nextOrder;
        this.nextInBucket = nextInBucket;
    }
}