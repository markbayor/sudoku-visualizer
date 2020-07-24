import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../contexts/user/UserContext";
import { SudokusContext, UserSudokuDetails, SudokuDetailsType } from "../../contexts/sudokus/SudokusContext";
import { SudokuBoard } from "../../components/SudokuBoard/SudokuBoard";
import { generateRandomSquares, DifficultyType, solve, setBoardAccordingToDifficulty } from "../../../functions";
import { HttpRequest } from "../../../utils";
import { SudokuList } from "../../components/SudokuList/SudokuList";

import './GamePage.scss'

const GamePage = () => {
  const { sudokusState, sudokusDispatch }: any = useContext(SudokusContext) //TODO
  const { selectedSudoku, sudokus } = sudokusState

  const fetchSudokus = async () => {
    const sudokusFetch: UserSudokuDetails[] = (await HttpRequest<UserSudokuDetails[]>(`${process.env.SERVER_URL || 'http://localhost:8080'}/sudoku/all`, 'GET', { auth: true })).data

    const sudokus: SudokuDetailsType[] = [...sudokusFetch].map((relation: UserSudokuDetails) => {
      relation.sudoku.progress = relation.progress
      relation.sudoku.completed = relation.completed
      return relation.sudoku
    })

    return sudokusDispatch({ type: 'GET_SUDOKUS', sudokus })
  }

  useEffect(() => {
    fetchSudokus()
  }, [])


  return (
    <div className='gamepage-container'>
      <SudokuBoard />
      <SudokuList sudokus={sudokus} />
    </div>
  )
}

export { GamePage }