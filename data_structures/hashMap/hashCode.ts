// FNV-hash variation for both string, number and boolean inputs
export function fnv1aHash(input: string | number | boolean): number {
    if (typeof input === "boolean") {
        return input ? 1231 : 1237;
    }

    const FNV_PRIME = 0x01000193; // 16777619
    const OFFSET_BASIS = 0x811c9dc5; // 2166136261

    let hash = OFFSET_BASIS;

    if (typeof input === 'number') {
        // Преобразуем число в 8-байтовое представление (64-битное float)
        const buffer = new ArrayBuffer(8);
        const view = new DataView(buffer);
        view.setFloat64(0, input);
        // Обрабатываем каждый байт
        for (let i = 0; i < 8; i++) {
            hash ^= view.getUint8(i);
            // Math.imul используется для 32-битного целочисленного умножения
            hash = Math.imul(hash, FNV_PRIME);
            // Приводим к 32-битному беззнаковому числу
            hash >>>= 0;
        }
    } else {
        // Для строки обрабатываем каждый символ (его код)
        for (let i = 0; i < input.length; i++) {
            hash ^= input.charCodeAt(i);
            hash = Math.imul(hash, FNV_PRIME);
            hash >>>= 0;
        }
    }

    return hash >>> 0;
}