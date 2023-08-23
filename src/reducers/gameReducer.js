import defaults from './defaults/gameDefaults'

import {
  MOVE,
  GAME_WON,
  RESET,
  SET_BOARD,
  RESET_WINNER,
  SET_WHITE_TO_MOVE,
} from '../actions/types/gameTypes'

// lower level reducer
import pegReducer from './gameReducer/pegReducer'

const gameReducer = (state = defaults, action = { type: false }) => {
  const { type, ...payload } = action
  switch (type) {
    case MOVE:
      const board = [
        ...state.board.slice(0, payload.id),
        pegReducer(state.board[payload.id], action, state.whiteToMove),
        ...state.board.slice(payload.id + 1),
      ]
      return Object.assign(
        {},
        state,
        {
          board,
          moves: [...state.moves, board],
        },
        { whiteToMove: !state.whiteToMove },
      )

    case GAME_WON:
      const { winner, winningPegs } = payload
      return Object.assign({}, state, { winner, winningPegs })

    case RESET:
      return defaults

    case SET_BOARD:
      return Object.assign({}, state, { board: payload.board })

    case RESET_WINNER:
      return Object.assign({}, state, { winner: '', winningPegs: [] })

    case SET_WHITE_TO_MOVE:
      return Object.assign({}, state, { whiteToMove: payload.whiteToMove })

    default:
      return state
  }
}

export default gameReducer
