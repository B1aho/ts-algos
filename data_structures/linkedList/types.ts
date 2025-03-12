export interface IListNode {
    next: IListNode | null;
    value: string;
}

export interface ILinkedList {
    append: (val: string) => void;
    prepend: (val: string) => void;
    size: () => number;
    at: (idx: number) => IListNode | null;
    pop: () => string | null;
    contains: (val: string) => boolean;
    find: (val: string) => number | null;
    toString: () => string;
    insertAt: (value: string, idx: number) => boolean;
    removeAt: (idx: number) => string | null;
}