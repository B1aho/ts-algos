/**
 * Write a function knightMoves(start: [x, y], end: [x, y]) that finds the shortest path 
 * for a knight to move from the start position to the end position on a standard 8×8 chessboard. 
 * 
 * The function should return the sequence of moves leading to the destination.
 */

type coord = [x: number, y: number];
const MAX_COORD = 8;

// BFS method:
function knightMoves(begin: coord, end: coord): void | null {
    const visited = new Set<string>();
    const path = new Map<string, coord>();
    const queue = [begin];
    while (queue.length) {
        const currMove = queue.shift();
        if (!currMove) break;
        if (currMove.join('-') === end.join('-')) {
            return reconstructPath(path, begin, end);
        }
        const avaliableMoves = getAvaliableMoves(currMove);
        for (const move of avaliableMoves) {
            if (!visited.has(move.join('-'))) {
                path.set(move.join('-'), currMove);
                queue.push(move);
            }
        }
        visited.add(currMove.join('-'));
    }

    return null;
}

function getAvaliableMoves(move: coord): coord[] {
    const moves: coord[] = [];
    const [x, y] = move;
    const knightMoves = [
        [-2, -1], [-1, -2], [1, 2], [2, 1], [-2, 1], [-1, 2], [1, -2], [2, -1]
    ]

    for (const [dx, dy] of knightMoves) {
        let newX = x + dx;
        let newY = y + dy;

        if (newX >= 0 && newX < MAX_COORD && newY >= 0 && newY < MAX_COORD)
            moves.push([newX, newY]);
    }

    return moves;
}

// ищет массив по ссылке. Нужно переделать Map: key - [2,4].join('-'), value  - [2, 4]
function reconstructPath(path: Map<string, coord>, start: coord, end: coord) {
    const shortestPath: coord[] = [];
    let move: coord | undefined = end;
    while (move) {
        shortestPath.push(move);

        if (move.join('-') === start.join('-')) {
            break;
        }

        move = path.get(move.join('-'));
    }
    console.log(`Shortest path take ${shortestPath.length - 1} moves:\n`, shortestPath.reverse());
}

knightMoves([3, 3], [4, 3]);