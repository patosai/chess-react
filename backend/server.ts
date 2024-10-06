import express from 'express';
import { createServer } from 'node:http';
import expressSession from 'express-session';
import morgan from 'morgan';
import { Server } from 'socket.io';
// import cors from 'cors';

import logger from './src/logging';

import { authDetails, cors, login, logout, register, ensureAuthenticated } from './src/auth';
import { errorHandler } from './src/error';
import { create as createGame, join as joinGame, setupSockets } from './src/game';

const app = express();
const PORT: number = 8800;

const server = createServer(app);
const io = new Server(server);

app.use(cors);
app.use(morgan('combined'));

const sessionMiddleware = expressSession({
  secret: 'TODO-MAKE-RANDOM-SECRET',
  resave: true,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 * 7 }
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);

app.use(express.json())

app.post('/login', login);
app.post('/logout', logout);
app.post('/register', register);
app.get('/authDetails', authDetails);

app.use(ensureAuthenticated);

app.post('/create', createGame)
app.post('/join', joinGame)

app.use(errorHandler);

setupSockets(io);

server.listen(PORT,() => {
  logger.info(`server running on localhost:${PORT}`)
})