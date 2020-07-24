import React, { createContext } from 'react'
import { UserDetailsType } from '../user/UserContext';
import { Action } from './SudokusReducer'
import { DifficultyType } from '../../../functions';


export interface SudokuDetailsType {
  id?: string;
  difficulty: DifficultyType;
  startGrid: number[][];
  progress?: number[][];
  solution: number[][];
  completed: boolean;
}

export interface UserSudokuDetails {
  id: string;
  sudoku: SudokuDetailsType;
  progress: number[][];
  completed: boolean;
}

export interface SudokusState {
  selectedSudoku: SudokuDetailsType | null;
  sudokus: SudokuDetailsType[] | any;
}

export type SudokusContextType = {
  sudokusState: SudokusState;
  sudokusDispatch: React.Dispatch<Action>;
}

export const SudokusContext = createContext<Partial<SudokusContextType>>({})
