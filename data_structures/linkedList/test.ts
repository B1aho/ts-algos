// example uses class syntax - adjust as necessary
import { LinkedList } from "./linkedList";

const list = new LinkedList();

list.append("dog");
list.append("cat");
list.append("parrot");
list.append("hamster");
list.append("snake");
list.append("turtle");
list.prepend("monkey");
console.log(list.toString());
console.log('cat idx:', list.find("cat"));
console.log(list.size());
console.log(list.pop());
console.log(list.pop());
console.log(list.pop());
console.log(list.toString());
console.log(list.size());
console.log('Contains parrot:', list.contains('parrot'));
console.log('Dog index:', list.find("dog"));
list.insertAt('bull', 2);
console.log(list.toString());
list.removeAt(1);
console.log(list.toString());