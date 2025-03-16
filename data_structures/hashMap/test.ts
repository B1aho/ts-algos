import { HashMap } from "./hashMap";

const test = new HashMap(16, 0.75);
test.set('apple', 'red');
test.set('banana', 'yellow');
test.set('carrot', 'orange');
test.set('dog', 'brown');
test.set('elephant', 'gray');
test.set('frog', 'green');
test.set('grape', 'purple');
test.set('hat', 'black');
test.set('ice cream', 'white');
test.set('jacket', 'blue');
test.set('kite', 'pink');
test.set('lion', 'golden');
console.log(test.capacity);
test.set('ice cream', 'white-pink');
console.log(test.capacity);
test.set('moon', 'silver');
console.log(test.capacity);
console.log(test.length());
console.log(test.entries());
test.set('kite', 'kite-pink');
test.set('hat', 'perfect-black');
console.log(test.length());
console.log(test.entries());
console.log(test.has('ice cream'));
console.log(test.get('kite'));
console.log(test.remove('grape'));
console.log(test.remove('sccsa'));
console.log(test.length());
console.log(test.keys());
console.log(test.values());
console.log(test.clear());
console.log(test.entries());
/**
 * Test the other methods of your hash map, such as get(key), has(key), remove(key), length(), 
 * clear(), keys(), values(), and entries(), to check if they are still working as expected after 
 * expanding your hash map.
 */
