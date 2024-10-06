import React, {useEffect, useState} from 'react';

import './app.scss';

import Board from './board';
import Header from './header';
import ErrorModal from './errormodal';
import { get, post } from './request';
import { setError, setUsername, selectUsername, setGameId, selectGameId } from './redux/reducers/game';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import { connect as socketConnect } from './socket';

function ControlBar() {
  const gameId = useAppSelector(selectGameId);
  const dispatch = useAppDispatch();

  const [joinGameId, setJoinGameId] = useState<string | undefined>(undefined);

  async function joinGame(e: React.FormEvent) {
    e.preventDefault();
    const result = await post("/join", {gameId: joinGameId});
    if (result) {
      const { id } = result;
      dispatch(setGameId(id));
      socketConnect(id);
    }
  }

  async function createGame() {
    const result = await post("/create", {});
    if (result) {
      const { id } = result;
      dispatch(setGameId(id));
      socketConnect(id);
    }
  }

  return (
    <div className="controlBar">
      {gameId && <div>You are currently in game #{gameId}</div>}
      {!gameId && <div className="controls">
        <button onClick={createGame}>Create game</button>
        <form onSubmit={joinGame}>
          <input type="number" value={joinGameId} onChange={(e) => setJoinGameId(e.target.value)} />
          <input type="submit" value="Join game"/>
        </form>
      </div>}
    </div>
  )
}

export default function App() {
  const username = useAppSelector(selectUsername);
  const dispatch = useAppDispatch();

  async function getAuth() {
    const result = await get("/authDetails");
    if (result) {
      const { username } = result;
      dispatch(setUsername(username));
    }
  }

  useEffect(() => {
    getAuth();
  }, []);

  return (
    <>
      <Header/>
      <div className="app">
        <Board/>
        <ControlBar />
      </div>
      <ErrorModal/>
    </>
  );
}