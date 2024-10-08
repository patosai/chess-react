import React from 'react';
import './boardpiece.scss';
import { useAppSelector } from './redux/hooks';
import { selectGameData } from './redux/reducers/game';
import { Game } from './common/game';
import { move } from './socket';

type BoardPieceProps = {
  row: number,
  col: number,
}

export default function BoardPiece({row, col}: BoardPieceProps) {
  const gameData: Game | null = useAppSelector(selectGameData);

  if (!gameData) {
    return <div className="boardPiece">
    </div>
  }

  function onClick() {
    if (!gameData) {
      return;
    }
    move(gameData.id, row, col);
  }

  const state = gameData.state;
  const hasPiece = !!state[row][col]
  const isUserOnePiece = state[row][col] === gameData.userOneId;
  return <div className="boardPiece" onClick={onClick}>
    {hasPiece && <div className={"piece " + (isUserOnePiece ? "white" : "black")}></div>}
  </div>
}