import Database from 'better-sqlite3';
import crypto from 'crypto';
import process from 'process';

import { randomString } from './common';
import type { GameState, Game, GameModel } from '../../frontend/src/common/game';

export function hashPassword(password: string, salt: string) {
  return crypto.pbkdf2Sync(password, salt, 1000, 512, 'sha512').toString('hex');
}

export function hashedPasswordsEqual(password: string, salt: string, hashedPassword: string) {
  const hash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(hashedPassword));
}

const DATABASE = new Database(':memory:')

type User = {
  id: number,
  username: string,
  password: string,
  salt: string,
}

const DEFAULT_GAME_STATE = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
]

async function initDatabase() {
  if (!DATABASE) {
    throw new Error("database is null")
  }

  DATABASE.prepare(`CREATE TABLE "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "username" TEXT UNIQUE NOT NULL,
    "password" TEXT NOT NULL,
    "salt" TEXT NOT NULL
    )`
  ).run();

  DATABASE.prepare(`CREATE TABLE "games" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "userOneId" INTEGER NOT NULL,
    "userTwoId" INTEGER,
    "state" TEXT NOT NULL,
    "currentTurnUserId" INTEGER NOT NULL,
    FOREIGN KEY(userOneId) REFERENCES users(id),
    FOREIGN KEY(userTwoId) REFERENCES users(id),
    FOREIGN KEY(currentTurnUserId) REFERENCES users(id)
    )`
  ).run();
}

initDatabase();

process.on('exit', function() {
  DATABASE.close();
});

export function getUser(username: string, password: string): User {
  const user: User = (DATABASE.prepare('SELECT * FROM users WHERE username = ?').get(username)) as User;
  if (!user) {
    throw new Error("user not found")
  }

  if (hashedPasswordsEqual(password, user.salt, user.password)) {
    return user;
  }

  throw new Error("user not found")
}

export function createUser(username: string, password: string): User {
  let salt = randomString(20);
  DATABASE.prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)").run(username, hashPassword(password, salt), salt);
  return DATABASE.prepare("SELECT * FROM users WHERE username = ?").get(username) as User;
}

export function createGame(userId: number | null): GameModel {
  if (!userId) {
    throw new Error("not authenticated");
  }
  const info = DATABASE.prepare("INSERT INTO games (userOneId, state, currentTurnUserId) VALUES (?, ?, ?)").run(userId, JSON.stringify(DEFAULT_GAME_STATE), userId);
  const lastRowId = info.lastInsertRowid;
  const game = DATABASE.prepare("SELECT * FROM games WHERE rowid = ?").get(lastRowId) as GameModel;
  return game;
}

export function joinGame(gameId: number | null, userId: number | null) {
  if (!userId) {
    throw new Error("not authenticated");
  }
  if (!gameId) {
    throw new Error("no game ID provided");
  }

  const game = DATABASE.prepare("SELECT * FROM games WHERE id = ?").get(gameId) as GameModel

  if (!game) {
    throw new Error("game not found");
  }

  if (game.userOneId === userId || game.userTwoId === userId) {
    return;
  }

  if (game.userOneId && game.userTwoId) {
    throw new Error("game is full");
  }

  return DATABASE.prepare("UPDATE games SET userTwoId = ? WHERE id = ?").run(userId, gameId);
}

export function updateGame(gameId: number, newState: GameState, currentTurnUserId: number) {
  if (!gameId) {
    throw new Error("no game ID provided");
  }

  const game = DATABASE.prepare("SELECT * FROM games WHERE id = ?").get(gameId) as GameModel

  if (!game) {
    throw new Error("game not found");
  }

  DATABASE.prepare("UPDATE games SET state = ?, currentTurnUserId = ? WHERE id = ?").run(JSON.stringify(newState), currentTurnUserId, gameId);
}

export function getGame(gameId: number): Game {
  if (!gameId) {
    throw new Error("no game ID provided");
  }
  const game = DATABASE.prepare(`SELECT 
    games.*, 
    userOne.username AS userOneUsername, 
    userTwo.username AS userTwoUsername 
    FROM games
    LEFT JOIN users userOne ON userOne.id = games.userOneId
    LEFT JOIN users userTwo ON userTwo.id = games.userTwoId
    WHERE games.id = ?
   `).get(gameId) as GameModel
  if (!game) {
    throw new Error("game not found");
  }
  game["state"] = JSON.parse(game["state"]);
  return (game as unknown) as Game;
}