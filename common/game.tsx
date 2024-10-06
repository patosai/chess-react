export function moveValid(gameState: number[][], row: number, col: number) {
  return !!gameState[row][col];
}