export function makeImagePath(id: string, format?: string) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}

export function getPosterPath(id: string, format?: string) {
  if (id === "") return "";
  return `https://image.tmdb.org/t/p/${format ? format : "original"}${id}`;
}
