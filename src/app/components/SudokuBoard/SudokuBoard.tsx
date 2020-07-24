import React, { useEffect, useState, useContext, useRef, forwardRef } from "react";
import { SudokusContext, SudokuDetailsType } from "../../contexts/sudokus/SudokusContext";
import { HttpRequest } from "../../../utils";
import { isPossible, nextEmptySpot, DifficultyType, isSolved, randomizeBoard, getAffectedCells, verifyCell } from '../../../functions'

import './SudokuBoard.scss'

const SudokuBoard = () => {
  const { sudokusState, sudokusDispatch } = useContext(SudokusContext)
  const selectedSudoku: SudokuDetailsType | null | undefined = sudokusState?.selectedSudoku
  const defaultCellsRef: any = useRef({})

  const [cellNumberSelectorValues, setCellNumberSelectorValues] = useState({ rowIdx: -1, colIdx: -1 })
  const showCellNumberSelector = useRef(false)

  // const [canRestart, setCanRestart] = useState(1)
  const [visualize, setVisualize] = useState(false)

  const [speedSelect, setSpeedSelect] = useState(0.001)
  const [workingCoords, setWorkingCoords] = useState([-1, -1])
  const workingCellCoordsRef = useRef([-1, -1])
  const visitedCellsRef: any = useRef({})
  const affectedCellsRef: any = useRef({})

  const resetRefs = () => {
    affectedCellsRef.current = {}
    visitedCellsRef.current = {}
    workingCellCoordsRef.current = [-1, -1]
    setWorkingCoords([-1, -1])
  }

  const difficulties: DifficultyType[] = ['very easy', 'easy', 'medium', 'hard', 'insane']
  const [difficultySelect, setDifficultySelect] = useState('easy' as DifficultyType)

  const restartSudoku = async () => {
    affectedCellsRef.current = {}
    visitedCellsRef.current = {}
    if (sudokusDispatch) sudokusDispatch({ type: 'RESTART_SUDOKU', sudokuId: selectedSudoku?.id })
    // await HttpRequest(`${process.env.SERVER_URL || 'http://localhost:8080'}/sudoku/${selectedSudoku?.id}/save`,
    //   'PUT', {
    //   body: {
    //     progress: selectedSudoku?.startGrid
    //   }
    // })
  }

  const visualizeRecursiveSolve = (board: any, speed: number, callback?: any) => {
    if (visualize) {
      let emptySpot = nextEmptySpot(board);
      let row = emptySpot[0];
      let col = emptySpot[1];
      if (speed !== 0) setWorkingCoords([row, col])

      if (row === -1) {
        setVisualize(false)
        return callback(true)
      }

      let i = 1;
      (function nextStep() {
        setTimeout(() => {
          if (i <= 9) {
            workingCellCoordsRef.current = [row, col]
            if (isPossible(board, row, col, i)) {
              board[row][col] = i;
              visitedCellsRef.current[`${row}${col}`] = true
              visualizeRecursiveSolve(board, speed, function (solved: boolean) {
                if (solved) {
                  return
                } else {
                  board[row][col] = 0;
                  visitedCellsRef.current[`${row}${col}`] = false
                  i++
                  if (speed !== 0) {
                    setTimeout(nextStep, speed)
                  } else return nextStep()
                }
              })
            } else {
              i++
              if (speed !== 0) {
                setTimeout(nextStep, speed)
              } else return nextStep()
            }
          } else {
            if (speed !== 0) {
              setTimeout(callback, speed, false)
            } else return callback(false)
          }
        }, speed)
      })()
    } else return
  }

  useEffect(() => {
    if (visualize && selectedSudoku) {
      visualizeRecursiveSolve(selectedSudoku.progress, speedSelect)
    }
    workingCellCoordsRef.current = [-1, -1]
    setWorkingCoords([-1, -1])
  }, [visualize])

  // cell selector
  const CellNumberSelector = ({ row, col }: any) => {
    const handleSelection = (num: number) => {
      if (row >= 0 && col >= 0) {
        affectedCellsRef.current = {}

        if (num === 0) visitedCellsRef.current[`${row}${col}`] = false
        else visitedCellsRef.current[`${row}${col}`] = true

        if (sudokusDispatch) {
          setCellNumberSelectorValues({ rowIdx: -1, colIdx: -1 })
          showCellNumberSelector.current = false
          sudokusDispatch({ type: 'SET_CELL', sudokuId: selectedSudoku?.id, row, col, value: num })
        }
      }
    }

    return (
      <div className={`number-selector-container selector_r-${row}_c-${col}`}>
        <div className='number-selector-numbers-container'>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num: number, idx: number) => {
            return (
              <div key={num} className={`number-selector-cell`} onClick={() => handleSelection(num)}>
                {num}
              </div>
            )
          })}
        </div>
        <button disabled={cellNumberSelectorValues.colIdx === -1 || cellNumberSelectorValues.rowIdx === -1} className='big-button' onClick={() => {
          handleSelection(0)
          showCellNumberSelector.current = false
        }}>
          Empty
        </button>
      </div>
    )
  }
  console.log(isSolved(selectedSudoku))
  // single cell
  const SingleCell = forwardRef(({ rowIdx, colIdx, value, hasDefaultNum }: any, workingCellCoordsRef: any) => {

    const buildClassName = () => {
      let classname = `board-cell`
      if (hasDefaultNum) classname += ' default-cell'
      if (workingCellCoordsRef.current[0] === rowIdx && workingCellCoordsRef.current[1] === colIdx) classname += ` active-cell`
      if (visitedCellsRef && visitedCellsRef.current[`${rowIdx}${colIdx}`] === true) classname += ' visited-cell'

      if (affectedCellsRef.current[`${rowIdx}${colIdx}`] === true) {
        if (classname.includes('default')) classname += ' affected-default-cell'
        if (classname.includes('visited')) classname += ' affected-visited-cell'
        else classname += ' affected-cell'
      }

      if (value !== 0 && selectedSudoku && selectedSudoku.progress && !verifyCell(selectedSudoku.progress, rowIdx, colIdx, value)) classname += ' invalid-cell'
      return classname
    }

    const classname = buildClassName()

    return (
      <div className={classname}>
        <div className={value !== 0 ? 'number-div' : 'number-div-blank'} onClick={() => {
          if (!visualize && !defaultCellsRef.current[`${rowIdx}${colIdx}`] && !isSolved(selectedSudoku)) {
            affectedCellsRef.current = {}
            workingCellCoordsRef.current = [-1, -1]
            if (selectedSudoku && selectedSudoku.progress) {
              affectedCellsRef.current = getAffectedCells(rowIdx, colIdx)
            }
            setCellNumberSelectorValues({ colIdx, rowIdx })
            showCellNumberSelector.current = true
          } else {
            return
          }
        }}>
          {value !== 0 ? value : '_'}
        </div>
      </div>
    )
  })

  //  actual board
  return (
    <div className='game-container'>
      <div className='board-container'>
        <div className='board-square'>
          {
            selectedSudoku && selectedSudoku.progress ? selectedSudoku.progress.map((row: number[], rowIdx: number) => {
              return row.map((col: number, colIdx: number) => {
                return (
                  <SingleCell
                    key={`${rowIdx}${colIdx}`}
                    value={col}
                    rowIdx={rowIdx}
                    colIdx={colIdx}
                    ref={workingCellCoordsRef}
                    hasDefaultNum={col !== 0}
                  />
                )
              })
            }) : ''
          }
        </div>
        {!visualize ?
          <CellNumberSelector row={cellNumberSelectorValues.rowIdx} col={cellNumberSelectorValues.colIdx} />
          : ''
        }
      </div>
      <div className='options-container'>
        <div className='speed-select-container'>
          <div className='select-container'>
            <label>Visualize speed</label>
            <select className='speed-select' defaultValue={0.001} onChange={({ target: { value } }: any) => setSpeedSelect(value)}>
              <option value={0}>Select visualize speed</option>
              {[0, 0.001, 5, 10, 30, 50].map((value: number, idx: number) => {
                const speeds = ['Very Fast', 'Fast', 'Medium-fast', 'Medium-slow', 'Slow', 'Very slow']
                const speed = speeds[idx]
                return <option key={value} value={value}>{speed}</option>
              })}
            </select>
          </div>
          <button className='big-button' disabled={visualize || selectedSudoku === null || selectedSudoku === undefined || isSolved(selectedSudoku)} onClick={() => {
            restartSudoku()
            resetRefs()
            setVisualize(true)
          }}>Visualize!</button>
        </div>
        <div className='difficulty-select-container'>
          <div className='select-container'>
            <label>Difficulty</label>
            <select className='difficulty-select' defaultValue='easy' onChange={({ target: { value } }: any) => setDifficultySelect(value)}>
              {difficulties.map((value: DifficultyType) => {
                return <option key={value} value={value}>{`${value.slice(0, 1).toUpperCase()}${value.slice(1)}`}</option>
              })}
            </select>
          </div>
          <button className='big-button' disabled={visualize} onClick={() => {
            resetRefs()
            if (sudokusDispatch) return randomizeBoard(difficultySelect, sudokusDispatch, defaultCellsRef)
          }}>New random board</button>
          <button className='big-button' disabled={visualize || selectedSudoku === null || Object.keys(visitedCellsRef.current).length < 1} onClick={() => {
            restartSudoku()
          }}>Restart</button>
        </div>
      </div>
    </div>
  )
}

export { SudokuBoard }