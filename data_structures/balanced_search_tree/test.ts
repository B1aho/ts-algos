import { BSTtree } from "./BST";

const tree = new BSTtree<number>(randomSortedArr(40), "iterative");
let arr: number[] = [];
tree.printTree();
console.log('Is tree balanced: ', tree.isBalanced());
tree.levelOrder((val) => arr.push(val));
console.log('Level-order: ', arr);
arr = [];
tree.inOrder((val) => arr.push(val));
console.log('In-order: ', arr);
arr = [];
tree.postOrder((val) => arr.push(val));
console.log('Post-order: ', arr);
arr = [];
tree.preOrder((val) => arr.push(val));
console.log('Pre-order: ', arr);
// Make inbalance
let i = 105;
while (i < 125) {
    tree.insert(i);
    i += 5;
}
console.log('Is tree balanced: ', tree.isBalanced());
tree.rebalance();
console.log('Is tree balanced: ', tree.isBalanced());
tree.printTree();
arr = [];
tree.inOrder((val) => arr.push(val));
console.log('In-order: ', arr);
arr = [];
tree.postOrder((val) => arr.push(val));
console.log('Post-order: ', arr);
arr = [];
tree.preOrder((val) => arr.push(val));
console.log('Pre-order: ', arr);


function randomSortedArr(length: number): number[] {
    return Array.from({ length })
        .map((val, idx) => {
            return Math.floor(Math.random() * 100);
        })
        .sort((a, b) => a - b);

}