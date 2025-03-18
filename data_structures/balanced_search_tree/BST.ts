import { INode, ITree, queueItem, treeCallback, ValueType } from "./types";

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

export class BSTtree<T extends ValueType> implements ITree<T> {
    #root: INode<T> | null = null;

    constructor(
        input: T[] | null,
        buildOption: 'iterative' | 'recursive' = 'recursive'
    ) {
        if (input === null) return this;
        // #removeDuplicats(input) -
        if (buildOption === 'iterative') {
            this.#root = this.buildBSTiterative(input);
        } else {
            this.#root = this.buildBSTrecursive(input);
        }
    };

    // Рекрсивное построение BST, краткое и элегантное 
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

    // Using a queue-based approach, similar to BFS.
    // The nuance here is that this is a naive queue implementation, and the shift method is inefficient.
    // The proper Queue implementation is in a separate project folder.
    buildBSTiterative(input: T[]): Node<T> | null {
        if (input.length === 0) return null;

        let middle = Math.floor((input.length) / 2);
        const root: INode<T> | null = new Node<T>(middle as T);
        const queue: queueItem<T>[] = [];
        queue.push({ node: root, start: 0, end: input.length - 1 });
        // Пока очередь не пуста: 
        // Достаём узел с границами из очереди.
        // Определяем середину его левого и правого подмассивов.
        // Эти значения являются значениями левого и правого дочерних узлов
        // Прикрепляем их к корню и добавляем в очередь, со своими границами
        while (queue.length) {
            const { node, start, end } = queue.shift() as queueItem<T>;
            const middle = Math.floor((start + end) / 2);

            let leftMiddle = Math.floor((start + middle - 1) / 2);
            if (start <= middle - 1) {
                const leftNode = new Node<T>(leftMiddle as T);
                node.leftChild = leftNode;
                queue.push({ node: leftNode, start, end: middle - 1 })
            }

            let rightMiddle = Math.floor((middle + 1 + end) / 2);
            if (middle + 1 <= end) {
                const rightNode = new Node<T>(rightMiddle as T);
                node.rightChild = rightNode;
                queue.push({ node: rightNode, start: middle + 1, end })
            }
        }

        return this.#root;
    };

    insert(value: T) {
        if (!this.#root) {
            this.#root = new Node<T>(value);
            return true;
        }
        let node = this.#root;

        while (true) {
            if (value > node.value) {
                if (!node.rightChild) {
                    node.rightChild = new Node<T>(value);
                    return true;
                }
                node = node.rightChild;
            } else if (value < node.value) {
                if (!node.leftChild) {
                    node.leftChild = new Node<T>(value);
                    return true;
                }
                node = node.leftChild;
            } else return false
        }
    };

    // Draw pretty tree: First (above) - right subtree, then (down) - left subtree
    #prettyPrint(node: INode<T> | null, prefix = "", isLeft = true) {
        if (node === null) {
            return;
        }

        if (node.rightChild !== null) {
            this.#prettyPrint(node.rightChild, `${prefix}${isLeft ? "│   " : "    "}`, false);
        }

        console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.value}`);

        if (node.leftChild !== null) {
            this.#prettyPrint(node.leftChild, `${prefix}${isLeft ? "    " : "│   "}`, true);
        }
    };

    printTree() {
        this.#prettyPrint(this.#root);
    };

    delete(value: T) {
        return true;
    };

    find(value: T) {
        return null;
    };

    depth(node: INode<T>) {
        return 0;
    };

    height(node: INode<T>) {
        return 0;
    };

    inOrder(fn: treeCallback<T>) {

    };

    preOrder(fn: treeCallback<T>) {

    };

    postOrder(fn: treeCallback<T>) {

    };

    levelOrder(fn: treeCallback<T>) {

    };

    isBalanced() {
        return true;
    };

    rebalance() {

    };
};