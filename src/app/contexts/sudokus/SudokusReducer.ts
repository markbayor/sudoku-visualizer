import { SudokuDetailsType, SudokusState } from './SudokusContext'
import { setBoardAccordingToDifficulty } from '../../../functions'

export const initialSudokusState: SudokusState = {
  selectedSudoku: null,
  sudokus: []
}

type getSudokusAction = { type: 'GET_SUDOKUS'; sudokus: SudokuDetailsType[] }
type setSudokuAction = { type: 'SET_SUDOKU'; sudoku: SudokuDetailsType }
type addSudokuAction = { type: 'ADD_SUDOKU'; sudoku: SudokuDetailsType }
type saveSudokuAction = { type: 'SAVE_SUDOKU'; sudokuId: string, progress: number[][] }
type emptyStateAction = { type: 'EMPTY_STATE' }

type restartSudokuProgressAction = { type: 'RESTART_SUDOKU'; sudokuId?: string }
type setCellAction = { type: 'SET_CELL', sudokuId?: string, row: number, col: number, value: number }

export type Action =
  getSudokusAction |
  setSudokuAction |
  addSudokuAction |
  saveSudokuAction |
  emptyStateAction |
  restartSudokuProgressAction |
  setCellAction

function sudokusReducer(state: SudokusState, action: Action): SudokusState {
  let newState = { ...state }
  switch (action.type) {
    case 'EMPTY_STATE':
      newState = initialSudokusState
      return newState;
    case 'GET_SUDOKUS':
      newState.sudokus = action.sudokus
      return newState;
    case 'SET_SUDOKU':
      newState.selectedSudoku = action.sudoku
      return newState;
    case 'ADD_SUDOKU':
      newState.sudokus = [...newState.sudokus, action.sudoku]
      return newState;
    case 'SAVE_SUDOKU':
      newState.sudokus = newState.sudokus.map((_sudoku: SudokuDetailsType) => {
        if (_sudoku.id === action.sudokuId) {
          _sudoku.progress = JSON.parse(JSON.stringify(action.progress))
        }
        return _sudoku;
      })
      return newState
    case 'RESTART_SUDOKU':
      if (newState.selectedSudoku && newState.selectedSudoku.progress) {
        newState.selectedSudoku.progress = JSON.parse(JSON.stringify(newState.selectedSudoku.startGrid))
      }
      if (action.sudokuId) {
        newState.sudokus.map((sudoku: any) => {
          if (sudoku.id === action.sudokuId) {
            sudoku.progress = JSON.parse(JSON.stringify(sudoku.startGrid))
          }
          return sudoku;
        })
      }
      return newState;
    case 'SET_CELL':
      if (newState.selectedSudoku && newState.selectedSudoku.progress) {
        newState.selectedSudoku.progress[action.row][action.col] = action.value
      }
      return newState
    default:
      return newState;
  }
}

export { sudokusReducer }