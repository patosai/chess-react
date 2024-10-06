import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { post } from './request';

import './header.scss';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { setUsername, clearUsername, selectUsername } from './redux/reducers/game';

type LoginOrRegisterProps = {
  url: string,
  submitText: string,
}

function LoginOrRegister({url, submitText}: LoginOrRegisterProps) {
  const [username, setUsernameState] = useState("");
  const [password, setPasswordState] = useState("");
  const [show, setShow] = useState(false);

  const dispatch = useAppDispatch();

  async function onSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    const result = await post(url, {username: username, password: password});
    if (result) {
      const { username } = result;
      dispatch(setUsername(username));
    }
  }

  return (
    <>
      {show && 
      <div className="midScreenModal">
        <form onSubmit={onSubmit}>
          <input name="username" value={username} placeholder={"Username"} onChange={e => setUsernameState(e.target.value)} />
          <input type="password" name="password" value={password} placeholder={"Password"} onChange={e => setPasswordState(e.target.value)} />
          <input type="submit" value={submitText}/>
        </form>
      </div>}
      <div onClick={() => setShow(!show)}>{submitText}</div>
    </>
  );
}

function Logout() {
  const dispatch = useAppDispatch();

  async function onLogout() {
    const result = await post("/logout", {});
    if (result) {
      dispatch(clearUsername());
    }
  }

  return (
    <div onClick={onLogout}>Logout</div>
  );
}

export default function Header() {
  const username = useAppSelector(selectUsername);

  return (
    <header>
      <div className="headerWrapper">
        <div className="left">
          <h2>Tic Tac Toe</h2>
          
        </div>
        <div className="right">
          {username && <div>Logged in as {username}</div>}
          <LoginOrRegister url={"/login"} submitText={"Login"} />
          <LoginOrRegister url={"/register"} submitText={"Register"} />
          <Logout/>
        </div>
      </div>
    </header>

  );

}