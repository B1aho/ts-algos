export type ValueType = number | string;

export interface INode<T extends ValueType> {
    value: T;
    leftChild: INode<T> | null;
    rightChild: INode<T> | null;
}

export interface ITree<T extends ValueType> {
    buildBSTrecursive: (input: T[]) => INode<T> | null;
    buildBSTiterative: (input: T[]) => INode<T> | null;
    printTree: () => void;
    insert: (value: T) => boolean;
    delete: (value: T) => boolean;
    find: (value: T) => INode<T> | null;
    levelOrder: (fn: (value: T) => void) => void;
    inOrder: (fn: (value: T) => void) => void;
    preOrder: (fn: (value: T) => void) => void;
    postOrder: (fn: (value: T) => void) => void;
    height: (node: INode<T>) => number;
    depth: (node: INode<T>) => number;
    isBalanced: () => boolean;
    rebalance: () => void;
}

export type queueItem<T extends ValueType> = { node: INode<T>, start: number, end: number };