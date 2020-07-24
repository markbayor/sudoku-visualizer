import React, { useEffect, useState, useContext } from "react";
import { SudokusContext, UserSudokuDetails, SudokuDetailsType } from "../../contexts/sudokus/SudokusContext";

interface ISudokuMiniature {
  sudoku: SudokuDetailsType
}

const SudokuMiniature = ({ sudoku }: ISudokuMiniature) => {
  if (sudoku) {
    return (
      <div className='sudoku-miniature-container'>
        {
          sudoku && sudoku.progress && sudoku.progress.map((row: number[], rowIdx: number) => {
            return row.map((col: number, colIdx: number) => {
              return (
                <div className='sudoku-miniature_cell'>
                  <span className={`sudoku-miniature_span`}>{col !== 0 ? col : ''}</span>
                </div>
              )
            })
          })
        }
      </div>
    )
  }
  return null
}

export { SudokuMiniature }