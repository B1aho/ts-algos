// FNV-hash variation for both string, number and boolean inputs
// https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
export function fnv1aHash(input: string | number | boolean): number {
    if (typeof input === "boolean") {
        return input ? 1231 : 1237;
    }

    const FNV_PRIME = 0x01000193; // 16777619
    const OFFSET_BASIS = 0x811c9dc5; // 2166136261

    let hash = OFFSET_BASIS;

    if (typeof input === 'number') {
        // Convert the number to an 8-byte representation (64-bit float)
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setFloat64(0, input);
        // Process each byte
        for (let i = 0; i < 8; i++) {
            hash ^= view.getUint8(i);
            // Math.imul is used for 32-bit integer multiplication
            hash = Math.imul(hash, FNV_PRIME);
            // Convert to a 32-bit unsigned integer
            hash >>>= 0;
        }
    } else {
        // For a string, process each character (char code)
        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash = Math.imul(hash, FNV_PRIME);
            hash >>>= 0;
        }
    }

    return hash >>> 0;
}