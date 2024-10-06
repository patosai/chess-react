import { io } from 'socket.io-client';
import { store } from './redux/store';

import { setGameState } from './redux/reducers/game';

export const socket = io("http://localhost:8800/ws", {
  autoConnect: true
});

export function connect(gameId: number) {
  socket.emit('join', gameId);
}

export function disconnect(gameId: number) {
  socket.emit('leave', gameId);
}

export function move(gameId: number, row: number, col: number) {
  socket.emit('move', gameId, row, col);
}

socket.on('move', (state, currentTurnUserId, myUserId) => {
  store.dispatch(setGameState(state));
})