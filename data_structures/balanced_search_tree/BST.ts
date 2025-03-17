import { INode, ITree, ValueType } from "./types";

class Node<T extends ValueType> implements INode<T> {
    value: T;
    leftChild: INode<T> | null;
    rightChild: INode<T> | null;
    constructor(
        value: T,
        leftChild: INode<T> | null = null,
        rightChild: INode<T> | null = null
    ) {
        this.value = value;
        this.leftChild = leftChild;
        this.rightChild = rightChild;
    };
}

class BSTtree<T extends ValueType> implements ITree<T> {
    #root: INode<T> | null = null;

    constructor(
        input: T[] | null,
        buildOption: 'iterative' | 'recursive' = 'recursive'
    ) {
        if (input === null) return this;
        if (buildOption === 'iterative') {
            this.#root = this.buildBSTiterative(input);
        } else {
            this.#root = this.buildBSTrecursive(input);
        }
    };

    buildBSTrecursive(
        input: T[],
        start: number = 0,
        end: number = input.length - 1
    ) {
        if (start > end) {
            return null;
        }
        const middle = Math.floor((start + end) / 2);
        const node: INode<T> = new Node(
            input[middle],
            this.buildBSTrecursive(input, start, middle - 1),
            this.buildBSTrecursive(input, middle + 1, end)
        )
        return node;
    };

    // Using a queue-based approach, similar to BFS
    // The nuance here is that this is a naive queue implementation, and the shift method is inefficient
    // The proper Queue implementation is in a separate project folder
    buildBSTiterative(input: T[]): Node<T> | null {
        let middle = Math.floor((input.length) / 2);
        const root: INode<T> | null = new Node<T>(middle as T);
        const queue: { node: Node<T>, start: number, end: number }[] = [];

        while (queue.length) {

        }

        return root;
    };
}