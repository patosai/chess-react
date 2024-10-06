
export type GameModel = {
  id: number,
  userOneId: number,
  userTwoId: number,
  state: string,
  currentTurnUserId: number,
}

export type GameState = number[][]

export type Game = Omit<GameModel, "state"> & {
  state: GameState,
  userOneUsername: string,
  userTwoUsername: string
}

export function moveValid(gameState: GameState, row: number, col: number) {
  return !gameState[row][col];
}

export function canStart(game: Game) {
  return game.userOneId && game.userTwoId;
}