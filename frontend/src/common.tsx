export function range(n: number): number[] {
  return Array.from({length: n}, (x, i) => i);
}