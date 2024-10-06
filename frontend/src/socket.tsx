import { io } from 'socket.io-client';
import { store } from './redux/store';
import { Game } from './common/game';

import { setGameData } from './redux/reducers/game';

const socket = io("http://localhost:8800/", {
  withCredentials: true,
  autoConnect: false,
});

export function connect(gameId: number) {
  console.log("connecting to id", gameId);
  socket.connect();
  socket.emit('join', gameId);
}

export function disconnect(gameId: number) {
  socket.emit('leave', gameId);
  socket.disconnect();
}

export function move(gameId: number, row: number, col: number) {
  socket.emit('move', gameId, row, col);
}

socket.on('move', (gameData: Game) => {
  store.dispatch(setGameData(gameData));
})