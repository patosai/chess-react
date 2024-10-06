import React, {useEffect, useState} from 'react';

import './app.scss';

import Board from './board';
import Header from './header';
import { get } from './request';
import { setError, setUsername, selectUsername } from './redux/reducers/game';
import { useAppSelector, useAppDispatch } from './redux/hooks';

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
      </div>
    </>
  );
}