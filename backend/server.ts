import express from 'express';
import { createServer } from 'node:http';
import expressSession from 'express-session';
import morgan from 'morgan';
import { Server } from 'socket.io';

import logger from './src/logging';

import { authDetails, cors, login, logout, register, ensureAuthenticated } from './src/auth';

const app = express();
const PORT: number = 8800;

const server = createServer(app);
const io = new Server(server);

app.use(cors);

app.use(morgan('combined'));
app.use(expressSession({
  secret: 'TOOD-MAKE-RANDOM-SECRET',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(express.json())

app.post('/login', login);
app.post('/logout', logout);
app.post('/register', register);
app.get('/authDetails', authDetails);

app.use(ensureAuthenticated);

server.listen(PORT,() => {
  logger.info(`server running on localhost:${PORT}`)
})