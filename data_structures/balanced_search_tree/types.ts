export type ValueType = number | string;

export interface INode<T extends ValueType> {
    value: T;
    leftChild: INode<T> | null;
    rightChild: INode<T> | null;
}

export type treeCallback<T> = (value: T) => void;

export interface ITree<T extends ValueType> {
    buildBSTrecursive: (input: T[]) => INode<T> | null;
    buildBSTiterative: (input: T[]) => INode<T> | null;
    printTree: () => void;
    insert: (value: T) => boolean;
    delete: (value: T) => boolean;
    find: (value: T) => INode<T> | null;
    levelOrder: (fn: treeCallback<T>) => void;
    inOrder: (fn: treeCallback<T>) => void;
    preOrder: (fn: treeCallback<T>) => void;
    postOrder: (fn: treeCallback<T>) => void;
    height: (node: INode<T>) => number;
    depth: (node: INode<T>) => number;
    isBalanced: () => boolean;
    rebalance: () => void;
}

export type queueItem<T extends ValueType> = { node: INode<T>, start: number, end: number };