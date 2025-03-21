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

        input = this.#removeDuplicats(input);

        if (buildOption === 'iterative') {
            this.#root = this.buildBSTiterative(input);
        } else {
            this.#root = this.buildBSTrecursive(input);
        }
    };

    // Two pointers method that reduce duplicats
    #removeDuplicats(arr: T[]) {
        let l = 0, r = 0;

        while (r < arr.length) {
            if (arr[l] !== arr[r]) {
                l++;
                arr[l] = arr[r]
            }
            r++;
        }
        return arr.slice(0, l + 1);
    }

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
        const root: INode<T> | null = new Node<T>(input[middle] as T);
        const queue: queueItem<T>[] = [];
        queue.push({ node: root, start: 0, end: input.length - 1 });

        // While the queue is not empty:
        // Dequeue a node with bounds from the queue
        // Find the middle of its left and right subarrays
        // These values become the left and right child nodes
        // Attach them to the root and push them into the queue with their respective bounds
        while (queue.length) {
            const { node, start, end } = queue.shift() as queueItem<T>;
            const middle = Math.floor((start + end) / 2);

            let leftMiddle = Math.floor((start + middle - 1) / 2);
            if (start <= middle - 1) {
                const leftNode = new Node<T>(input[leftMiddle] as T);
                node.leftChild = leftNode;
                queue.push({ node: leftNode, start, end: middle - 1 })
            }

            let rightMiddle = Math.floor((middle + 1 + end) / 2);
            if (middle + 1 <= end) {
                const rightNode = new Node<T>(input[rightMiddle] as T);
                node.rightChild = rightNode;
                queue.push({ node: rightNode, start: middle + 1, end })
            }
        }

        return root;
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

    // Iterative insert
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

    // Find min value in subtree
    #findMin(root: INode<T>): T {
        let node = root;
        while (node && node.leftChild) {
            node = node.leftChild;
        }
        return node.value;
    }

    // Recursive delete
    #deleteHelper(node: INode<T> | null, value: T): INode<T> | null {
        // No such element
        if (node === null) {
            return null;
        }

        if (value < node.value) {
            node.leftChild = this.#deleteHelper(node.leftChild, value);
        } else if (value > node.value) {
            node.rightChild = this.#deleteHelper(node.rightChild, value);
        } else {
            /**
             * No children → simply delete the node.
             * One child → replace the node with its child.
             * Two children → find the minimum node in the right subtree, replace the node with it, 
             * and delete the minimum node (find next in-order successor)
             */
            if (!node.leftChild && !node.rightChild) {
                return null;
            } else if (!node.rightChild) {
                const retNode = node.leftChild;
                // This nullification is not mandatory in JavaScript, unless you don't trust the GC
                node.leftChild = null;
                return retNode;
            } else if (!node.leftChild) {
                const retNode = node.rightChild;
                node.rightChild = null;
                return retNode;
            } else {
                let minVal = this.#findMin(node.rightChild);
                node.value = minVal;
                // Solve case when minNode in right subtree has own children 
                node.rightChild = this.#deleteHelper(node.rightChild, minVal)
            }
        }
        // Return child node that was updated or not updated
        return node;
    };

    delete(value: T): boolean {
        if (!this.#root) {
            return false;
        }
        return this.#deleteHelper(this.#root, value) ? true : false;
    };

    #findHelper(node: INode<T> | null, value: T): INode<T> | null {
        if (node === null)
            return null;

        if (value < node.value) {
            return this.#findHelper(node.leftChild, value);
        } else if (value > node.value) {
            return this.#findHelper(node.leftChild, value);
        } else {
            return node;
        }
    };

    // Find and return node by its value
    find(value: T): INode<T> | null {
        return this.#findHelper(this.#root, value);
    };

    // Breadth first traverse
    // Can be implementes both: recursive (emulate queue, pass node list of curr level) and iterative (queue)
    levelOrder(fn: treeCallback<T>) {
        if (!this.#root) return;

        const queue: INode<T>[] = [];
        queue.push(this.#root);
        while (queue.length) {
            const currNode = queue.shift() as INode<T>;
            fn(currNode.value);
            if (currNode.leftChild) queue.push(currNode.leftChild);
            if (currNode.rightChild) queue.push(currNode.rightChild);
        }
        return;
    };

    #inOrderHelper(node: INode<T>, fn: treeCallback<T>) {
        if (node.leftChild) this.#inOrderHelper(node.leftChild, fn);
        fn(node.value);
        if (node.rightChild) this.#inOrderHelper(node.rightChild, fn);
    }

    // Depth first travers: in-order
    inOrder(fn: treeCallback<T>) {
        if (!this.#root) return;

        this.#inOrderHelper(this.#root, fn);
    };

    #preOrderHelper(node: INode<T>, fn: treeCallback<T>) {
        fn(node.value);
        if (node.leftChild) this.#preOrderHelper(node.leftChild, fn);
        if (node.rightChild) this.#preOrderHelper(node.rightChild, fn);
    }

    // Depth first travers: pre-order
    preOrder(fn: treeCallback<T>) {
        if (!this.#root) return;

        this.#preOrderHelper(this.#root, fn);
    };

    #postOrderHelper(node: INode<T>, fn: treeCallback<T>) {
        if (node.leftChild) this.#postOrderHelper(node.leftChild, fn);
        if (node.rightChild) this.#postOrderHelper(node.rightChild, fn);
        fn(node.value);
    }

    // Depth first travers: post-order
    postOrder(fn: treeCallback<T>) {
        if (!this.#root) return;

        this.#postOrderHelper(this.#root, fn);
    };

    // Node Depth - number of edges in the path from a given node to the tree’s root node
    // In fact it is just level-order (BFS), from root to node with tracking level
    depth(node: INode<T>): number {
        if (!this.#root) return -1;

        const queue: { currNode: INode<T>, level: number }[] = [];
        queue.push({ currNode: this.#root, level: 0 });

        while (queue.length) {
            const { currNode, level } = queue.shift() as { currNode: INode<T>, level: 0 };
            if (node === currNode) return level;
            if (currNode.leftChild) queue.push({ currNode: currNode.leftChild, level: level + 1 });
            if (currNode.rightChild) queue.push({ currNode: currNode.rightChild, level: level + 1 });
        }

        return -1;
    };

    // Node height - the longest path from a given node to a leaf node.
    // Recursively find hight of left node and right node and return max + 1;
    height(node: INode<T>): number {
        if (!node) return 0;

        let leftNodeHeight = node.leftChild ? this.height(node.leftChild) : 0;
        let rightNodeHeight = node.rightChild ? this.height(node.rightChild) : 0;

        return Math.max(rightNodeHeight, leftNodeHeight) + 1;
    };

    // 
    #countHeightAndBalance(node: INode<T> | null): { height: number, balance: number } {
        if (!node) return { height: 0, balance: 0 };

        let left = this.#countHeightAndBalance(node.leftChild);
        let right = this.#countHeightAndBalance(node.rightChild);

        let balance = Math.abs(left.height - right.height);
        let height = 1 + Math.max(left.height, right.height);

        return { height, balance };
    }

    // A balanced tree is one where the difference between heights of the left subtree and the right subtree of 
    // every node is not more than 1
    isBalanced(): boolean {
        if (!this.#root) return true;

        const { balance } = this.#countHeightAndBalance(this.#root);
        return balance <= 1;
    };

    rebalance(): void {
        let sortedArr: T[] = [];
        this.inOrder((val) => sortedArr.push(val));
        sortedArr = this.#removeDuplicats(sortedArr);
        this.#root = this.buildBSTiterative(sortedArr);
    };
};