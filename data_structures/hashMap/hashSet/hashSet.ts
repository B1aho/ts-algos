import { HashMap } from "../hashMap";
import { Key } from "../types";

// Implement Set as a wrappe on my HashMap
class HashSet<K extends Key> {
    #map: HashMap<K, boolean>;

    constructor(capacity?: number, loadFactor?: number) {
        this.#map = new HashMap<K, boolean>(capacity, loadFactor);
    }

    add(item: K): void {
        this.#map.set(item, true);
    }

    has(item: K): boolean {
        return this.#map.has(item);
    }

    delete(item: K): boolean {
        return this.#map.remove(item);
    }

    clear(): void {
        this.#map.clear();
    }

    values(): K[] {
        return this.#map.keys();
    }
    // Add union and other set methods + add set interface
    // ...
}
