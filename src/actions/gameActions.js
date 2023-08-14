import {
  MOVE,
  GAME_WON,
  RESET,
  SET_BOARD,
  RESET_WINNER,
  SET_WHITE_TO_MOVE,
} from './types/gameTypes'

export const move = (id = 0) => ({
  type: MOVE,
  id,
})

export const gameWon = ({ winner = '', winningPegs = [] }) => ({
  type: GAME_WON,
  winner,
  winningPegs,
})

export const reset = () => ({
  type: RESET,
})

export const setBoard = (board = []) => ({
  type: SET_BOARD,
  board,
})

export const resetWinner = () => ({
  type: RESET_WINNER,
})

export const setWhiteToMove = (whiteToMove = true) => ({
  type: SET_WHITE_TO_MOVE,
  whiteToMove,
})
