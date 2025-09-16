let data: Record<string, string[]> = $state({});

export function getFavoriteMoves(sfenx: string) {
  return data[sfenx] || [];
}

export function insertFavoriteMove(sfenx: string, move: string) {
  if (data[sfenx]?.includes(move)) return;
  if (!data[sfenx]) data[sfenx] = [];
  data[sfenx].push(move);
}

export function removeFavoriteMove(sfenx: string, move: string) {
  data[sfenx] = data[sfenx].filter((m) => m !== move);
}
