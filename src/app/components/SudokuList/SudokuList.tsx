import React, { useEffect, useState, useContext } from "react";
import { SudokusContext, UserSudokuDetails, SudokuDetailsType } from "../../contexts/sudokus/SudokusContext";
import { SudokuMiniature } from "../SudokuMiniature/SudokuMiniature";

interface ISudokuList {
  sudokus: SudokuDetailsType[]
}

const SudokuList = ({ sudokus }: ISudokuList) => {

  return (
    <div className='sudoku-list-container'>
      {
        sudokus && sudokus.map(sudoku => {
          return <SudokuMiniature sudoku={sudoku} />
        })
      }
    </div>
  )
}

export { SudokuList }