import React from 'react';

import BoardPiece from './boardpiece';
import { range } from './common';

import './board.scss';

const BOARD_SIZE: number = 3;

type BoardRowProps = {
  row: number,
}

function BoardRow({row}: BoardRowProps) {
  return <div className="row">
    {range(BOARD_SIZE).map(colNum => {
      const key = row.toString() + "|" + colNum.toString();
      return <BoardPiece key={key}></BoardPiece>
    })}
  </div>
}

export default function Board() {
  return (
    <div className="board">
      {range(BOARD_SIZE).map(rowNum => {
        return <BoardRow row={rowNum}></BoardRow>
      })}
    </div>
  )
}