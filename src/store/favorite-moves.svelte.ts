let data: {
  [key: string]: string[] | undefined;
} = $state({});

let currentMoves: string[] = $state([]);
export class FavoriteMovesStore {
  static get(sfenx: string) {
    return data[sfenx];
  }
  static set(sfenx: string, moves: string[]) {
    data[sfenx] = moves;
  }
  static insert(sfenx: string, move: string) {
    if (!data[sfenx]) throw new Error(`Invalid sfenx: ${sfenx}`);
    if (data[sfenx].includes(move)) return;
    data[sfenx].push(move);
  }
  static delete(sfenx: string, move: string) {
    if (!data[sfenx]) throw new Error(`Invalid sfenx: ${sfenx}`);
    data[sfenx] = data[sfenx].filter((m) => m !== move);
  }
}
