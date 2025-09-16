let data: {
  [key: string]: string[] | undefined;
} = $state({});

export function getFavoriteMoves(sfenx: string) {
  return data[sfenx];
}

export function setFavoriteMoves(sfenx: string, moves: string[]) {
  data[sfenx] = moves;
}

export function insertFavoriteMove(sfenx: string, move: string) {
  if (!data[sfenx]) throw new Error(`Invalid sfenx: ${sfenx}`);
  if (data[sfenx].includes(move)) return;
  data[sfenx].push(move);
}

export function removeFavoriteMove(sfenx: string, move: string) {
  if (!data[sfenx]) throw new Error(`Invalid sfenx: ${sfenx}`);
  data[sfenx] = data[sfenx].filter((m) => m !== move);
}
