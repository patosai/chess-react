import { RequestHandler } from 'express';
import { type Server } from 'socket.io';
import logger from './logging';

import { reqUserId } from './auth';

import { createGame, getGame, joinGame, updateGame } from './db';
import { SessionSocket } from './auth';
import { canStart, moveValid } from '../../frontend/src/common/game';

export const create: RequestHandler = (req, res, next) => {
  const userId = reqUserId(req);
  const game = createGame(userId);
  res.json({"id": game.id});
}

export const join: RequestHandler = (req, res, next) => {
  const userId = reqUserId(req);
  const gameId = req.body.gameId;
  joinGame(gameId, userId);
  res.json(getGame(gameId));
}

export function setupSockets(io: Server) {
  io.on('connection', (defaultSocket) => {
    logger.info("socket connected");
    const socket = defaultSocket as SessionSocket;

    socket.on('join', (gameId) => {
      logger.info(`joined room ${gameId}`)
      socket.join(gameId.toString());
      logger.info(`emitting to room ${gameId.toString()}: ${JSON.stringify(getGame(gameId))}`)
      io.to(gameId.toString()).emit('move', getGame(gameId));
    });

    socket.on('move', (gameId: number, row: number, col: number) => {
      const userId = socket.request.session.userId;
      const game = getGame(gameId);
      logger.info(`moved: userId ${userId}, gameId ${gameId}, gameCurrentTurn ${game.currentTurnUserId}, row ${row} col ${col}`)
      if (userId && canStart(game) && game.currentTurnUserId === userId && moveValid(game.state, row, col)) {
        game.state[row][col] = userId;
        updateGame(gameId, game.state, game.userOneId === userId ? game.userTwoId : game.userOneId);
        io.to(gameId.toString()).emit('move', getGame(gameId));
      }
    });
  });
}