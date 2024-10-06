import { Request, RequestHandler } from 'express';
import type { IncomingMessage } from 'http';
import type { SessionData } from 'express-session';
import type { Socket } from 'socket.io';

import { getUser, createUser } from "./db";

declare module "express-session" {
  interface SessionData {
    username: string | null,
    userId: number | null,
  }
}

interface SessionIncomingMessage extends IncomingMessage {
  session: SessionData
};

export interface SessionSocket extends Socket {
  request: SessionIncomingMessage
};

export function reqUserId(req: Request): number | null {
  return req.session.userId || null;
}

export const cors: RequestHandler = (req, res, next) => {
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header");

  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }
  return next();
};

export const login: RequestHandler = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    throw new Error("invalid username or password")
  }
  const user = getUser(username, password)
  req.session.username = user.username;
  req.session.userId = user.id;
  req.session.save()
  res.json({username: user.username});
}

export const logout: RequestHandler = (req, res, next) => {
  req.session.username = null;
  req.session.userId = null;
  req.session.save()
  res.json({});
}

export const register: RequestHandler = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const user = createUser(username, password);

  req.session.username = user.username;
  req.session.userId = user.id;
  req.session.save()
  res.json({username: username});
}

export const authDetails: RequestHandler = (req, res, next) => {
  res.json({"username": req.session.username});
}

export const ensureAuthenticated: RequestHandler = (req, res, next) => {
  if (!req.session.username) {
    res.json({"error": "not authenticated"}).status(403);
    return;
  }
  next();
}