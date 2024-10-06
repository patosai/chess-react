import Database from 'better-sqlite3';
import crypto from 'crypto';
import process from 'process';

import { randomString } from './common';

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

async function initDatabase() {
  if (!DATABASE) {
    throw new Error("database is null")
  }

  DATABASE.prepare(`CREATE TABLE "users" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "username" TEXT UNIQUE,
    "password" TEXT,
    "salt" TEXT
    )`
  ).run();

  DATABASE.prepare(`CREATE TABLE "games" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "userOneId" INTEGER,
    "userTwoId" INTEGER,
    "state" TEXT,
    FOREIGN KEY(userOneId) REFERENCES users(id),
    FOREIGN KEY(userTwoId) REFERENCES users(id)
    )`
  ).run();
}

initDatabase();

process.on('exit', function() {
  DATABASE.close();
});

export function getUser(username: string, password: string): User | null {
  const user: User = (DATABASE.prepare('SELECT * FROM users WHERE username = ?').get(username)) as User;
  if (!user) {
    return null;
  }
  if (hashedPasswordsEqual(password, user.salt, user.password)) {
    return user;
  }

  return null;
}

export function createUser(username: string, password: string) {
  let salt = randomString(20);
  return DATABASE.prepare("INSERT INTO users (username, password, salt) VALUES (?, ?, ?)").run(username, hashPassword(password, salt), salt);
}