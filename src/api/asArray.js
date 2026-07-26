// Defensively pull the first array-shaped value out of a set of candidates.
// Backend responses don't always match documented shapes exactly (wrapped
// in a different key, paginated differently, etc). Without this, calling
// .map()/.reduce() on something that isn't actually an array throws and
// crashes the whole page to a blank white screen with no visible error.
export function asArray(...candidates) {
  for (const c of candidates) {
    if (Array.isArray(c)) return c;
  }
  return [];
}
