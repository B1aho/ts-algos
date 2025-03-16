export type Key = string | number | boolean;

export interface IHashMapNode {
    key: Key;
    value: any;
    prevOrder: IHashMapNode | null;
    nextOrder: IHashMapNode | null;
    nextInBucket: IHashMapNode | null;
}

export type IHashMap = IHashMapNode[];