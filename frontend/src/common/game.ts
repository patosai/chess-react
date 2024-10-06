
export type GameModel = {
  id: number,
  userOneId: number,
  userTwoId: number,
  state: string,
  finished: number,
  currentTurnUserId: number,
}

export type GameState = number[][]

export type Game = Omit<GameModel, "state"|"finished"> & {
  state: GameState,
  finished: boolean,
  userOneUsername: string,
  userTwoUsername: string
}

export function moveValid(gameState: GameState, row: number, col: number) {
  return !gameState[row][col];
}

export function canStart(game: Game) {
  return game.userOneId && game.userTwoId && !game.finished;
}

export function gameFinished(state: GameState) {
  for (let row = 0; row < 3; ++row) {
    if (state[row][0] === state[row][1] && state[row][1] === state[row][2] && state[row][2] !== 0) {
      return true;
    }
  }
  for (let col = 0; col < 3; ++col) {
    if (state[0][col] === state[1][col] && state[1][col] === state[2][col] && state[2][col] !== 0) {
      return true;
    }
  }
  if (state[0][0] === state[1][1] && state[1][1] === state[2][2] && state[2][2] !== 0) {
    return true;
  }
  if (state[0][2] === state[1][1] && state[1][1] === state[0][2] && state[0][2] !== 0) {
    return true;
  }
  return false;
}