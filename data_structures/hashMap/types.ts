export type Key = string | number | boolean;

export interface IHashMapNode<K extends Key, V> {
    key: K;
    value: V;
    prevOrder: IHashMapNode<K, V> | null;
    nextOrder: IHashMapNode<K, V> | null;
    nextInBucket: IHashMapNode<K, V> | null;
}

export type HashNodeNullable<K extends Key, V> = IHashMapNode<K, V> | null;

export interface IHashMap<K extends Key, V> {
    capacity: number;
    loadFactor: number;
    Map: HashNodeNullable<K, V>[];
    hash: (key: K) => number;
    set: (key: K, value: V) => HashNodeNullable<K, V>[];
    get: (key: K) => V | null;
    has: (key: K) => boolean;
    remove: (key: K) => boolean;
    length: () => number;
    clear: (isDeep?: boolean) => void;
    keys: () => K[];
    values: () => V[];
    entries: () => [K, V][];
}