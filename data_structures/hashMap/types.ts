export type Key = string | number | boolean;

export interface IHashMapNode<K extends Key, V> {
    key: K;
    value: V;
    prevOrder: IHashMapNode<K, V> | null;
    nextOrder: IHashMapNode<K, V> | null;
    nextInBucket: IHashMapNode<K, V> | null;
}

export interface IHashMap<K extends Key, V> {
    hashMap: IHashMapNode<K, V>[];
    set: (key: K, value: V) => boolean;
    get: (key: K) => V;
    has: (key: K) => boolean;
    remove: (key: K) => boolean;
    length: () => number;
    clear: () => void;
    keys: () => K[];
    values: () => V[];
    entries: () => [K, V][];
}