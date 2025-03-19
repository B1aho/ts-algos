import { BSTtree } from "./BST";

const tree = new BSTtree(randomSortedArr(50));
tree.printTree();


function randomSortedArr(length: number): number[] {
    return Array.from({ length })
        .map((val, idx) => {
            return Math.floor(Math.random() * length);
        })
        .sort((a, b) => a - b);

}