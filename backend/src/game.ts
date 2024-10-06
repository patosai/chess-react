import { RequestHandler } from 'express';
import { type Server } from 'socket.io';

import { reqUserId } from './auth';

import { createGame, getGame, joinGame, updateGame } from './db';
import { SessionSocket } from './auth';

export const create: RequestHandler = (req, res, next) => {
  const userId = reqUserId(req);
  const game = createGame(userId);
  res.json({"id": game.id});
}

export const join: RequestHandler = (req, res, next) => {
  const userId = reqUserId(req);
  const gameId = req.body.gameId;
  joinGame(gameId, userId);
  console.log("getting game", getGame(gameId));
  res.json(getGame(gameId));
}

export function setupSockets(io: Server) {
  // TODO authentication
  io.on('connection', (defaultSocket) => {
    const socket = defaultSocket as SessionSocket;
    socket.on('join', (gameId) => {
      socket.join(gameId.toString());
    });

    socket.on('move', (gameId: number, row: number, col: number) => {
      const userId = socket.request.session.userId;
      const game = getGame(gameId);
      if (userId && game.currentTurnUserId === userId) {
        game.state[row][col] = userId;
        updateGame(gameId, game.state, game.userOneId === userId ? game.userTwoId : game.userOneId);
        socket.to(gameId.toString()).emit('move', getGame(gameId));
      }
    });

  });

}