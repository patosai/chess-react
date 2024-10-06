import { RequestHandler } from 'express';

import { getUser, createUser } from "./db";

declare module "express-session" {
  interface SessionData {
    username: string | null,
  }
}

export const cors: RequestHandler = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
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
    res.status(400);
    res.json({"error": "invalid username or password"});
    return;
  }
  const user = getUser(username, password)
  if (!user) {
    res.status(400);
    res.json({"error": "invalid username or password"});
    return;
  }
  req.session.username = user.username;
  res.json({username: user.username});
}

export const logout: RequestHandler = (req, res, next) => {
  req.session.username = null;
  res.json({});
}

export const register: RequestHandler = (req, res, next) => {
  console.log(req.body);
  const username = req.body.username;
  const password = req.body.password;
  const result = createUser(username, password);
  if (!result) {
    res.json({"error": "could not register"});
    return
  }
  req.session.username = username;
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