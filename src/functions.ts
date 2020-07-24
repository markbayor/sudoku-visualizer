import { SudokuDetailsType } from "./app/contexts/sudokus/SudokusContext";
import { Action } from "./app/contexts/sudokus/SudokusReducer";

function generateRandomSquares() {
  let arr = Array(9).fill(Array(9).fill(0));
  let vals1 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let vals2 = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let vals3 = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  return arr.map((row: number[], idx: number) => {
    if ([0, 1, 2].includes(idx)) {
      return row.map((col, _idx) => {
        if ([0, 1, 2].includes(_idx)) {
          let valsIdx = Math.floor(Math.random() * vals1.length);
          let val = vals1[valsIdx];
          vals1.splice(valsIdx, 1);
          col = val;
        }
        return col;
      });
    }
    if ([3, 4, 5].includes(idx)) {
      return row.map((col, _idx) => {
        if ([3, 4, 5].includes(_idx)) {
          let valsIdx = Math.floor(Math.random() * vals2.length);
          let val = vals2[valsIdx];
          vals2.splice(valsIdx, 1);
          col = val;
        }
        return col;
      });
    }
    if ([6, 7, 8].includes(idx)) {
      return row.map((col, _idx) => {
        if ([6, 7, 8].includes(_idx)) {
          let valsIdx = Math.floor(Math.random() * vals3.length);
          let val = vals3[valsIdx];
          vals3.splice(valsIdx, 1);
          col = val;
        }
        return col;
      });
    }
    return row;
  });
}

function nextEmptySpot(board: number[][]) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] === 0)
        return [i, j];
    }
  }
  return [-1, -1];
}

const isPossible = (board: number[][], row: number, col: number, num: number) => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num) return false
    if (board[i][col] === num) return false
  }
  const row0 = (Math.floor(row / 3)) * 3
  const col0 = (Math.floor(col / 3)) * 3

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[row0 + i][col0 + j] === num) return false
    }
  }
  return true
}

const verifyCell = (board: number[][], row: number, col: number, num: number) => {
  for (let i = 0; i < 9; i++) {
    if (i !== col && board[row][i] === num) return false
    if (i !== row && board[i][col] === num) return false
  }
  const row0 = (Math.floor(row / 3)) * 3
  const col0 = (Math.floor(col / 3)) * 3

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (row0 + i !== row && col0 + j && board[row0 + i][col0 + j] === num) return false
    }
  }
  return true
}

const getAffectedCells = (row: number, col: number) => {
  const obj: any = {}
  for (let i = 0; i < 9; i++) {
    obj[`${row}${i}`] = true
    obj[`${i}${col}`] = true
  }

  const row0 = (Math.floor(row / 3)) * 3
  const col0 = (Math.floor(col / 3)) * 3

  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      obj[`${row0 + i}${[col0 + j]}`] = true
    }
  }
  return obj
}

const getCandidates = (board: number[][], row: number, col: number) => {
  let candidates = []
  for (let i = 1; i <= 9; i++) {
    if (isPossible(board, row, col, i)) {
      candidates.push(i)
    }
  }
  return candidates
}

const solve = (board: number[][]) => {
  let copy = [...board]
  let emptySpot = nextEmptySpot(copy);
  let row = emptySpot[0];
  let col = emptySpot[1];

  // there is no more empty spots
  if (row === -1) {
    return copy;
  }

  for (let num = 1; num <= 9; num++) {
    if (isPossible(copy, row, col, num)) {
      copy[row][col] = num;
      solve(copy);
    }
  }

  if (nextEmptySpot(copy)[0] !== -1)
    copy[row][col] = 0;

  return copy;
}

const isSolved = (sudoku: SudokuDetailsType | undefined | null): boolean => {
  if (sudoku) {
    if (sudoku.progress)
      if (nextEmptySpot(sudoku.progress)[0] !== -1) return false
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (sudoku.progress)
          if (!verifyCell(sudoku.progress, r, c, sudoku.progress[r][c])) return false
      }
    }
  }
  return true
}

export type DifficultyType = 'very easy' | 'easy' | 'medium' | 'hard' | 'insane'

const setBoardAccordingToDifficulty = (board: number[][], difficulty: DifficultyType) => {
  let copy = [...board]
  let counter: number = 0

  if (difficulty === 'very easy') {
    counter = 30
  } else if (difficulty === 'easy') {
    counter = 37
  } else if (difficulty === 'medium') {
    counter = 43
  } else if (difficulty === 'hard') {
    counter = 49
  } else if (difficulty === 'insane') {
    counter = 55
  }
  for (let i = 0; i <= counter; i++) {
    let randomRow = Math.floor(Math.random() * 9)
    let randomCol = Math.floor(Math.random() * 9)
    if (copy[randomRow][randomCol] !== 0) {
      copy[randomRow][randomCol] = 0
    } else {
      counter++
    }
  }
  return copy
}

const randomizeBoard = (difficulty: DifficultyType, dispatch: React.Dispatch<Action>, defaultValsRef?: any) => {
  if (!difficulty) return
  defaultValsRef.current = {}
  const random = generateRandomSquares()
  const solution = solve(JSON.parse(JSON.stringify(random)))
  const startGrid = setBoardAccordingToDifficulty(JSON.parse(JSON.stringify(solution)), difficulty)
  const progress = JSON.parse(JSON.stringify(startGrid))

  if (defaultValsRef) {
    progress.forEach((row: number[], rowIdx: number) => {
      row.forEach((col: number, colIdx: number) => {
        if (col !== 0) defaultValsRef.current[`${rowIdx}${colIdx}`] = true
      })
    })
  }

  return dispatch({ type: 'SET_SUDOKU', sudoku: { completed: false, difficulty, startGrid, solution, progress } })
}

export {
  generateRandomSquares,
  nextEmptySpot,
  isPossible,
  getCandidates,
  solve,
  isSolved,
  setBoardAccordingToDifficulty,
  randomizeBoard,
  getAffectedCells,
  verifyCell
}