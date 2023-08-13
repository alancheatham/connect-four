import defaults from './defaults/gameDefaults'

import { MOVE, GAME_WON, RESET } from '../actions/types/gameTypes'

// lower level reducer
import pegReducer from './gameReducer/pegReducer'

const gameReducer = (state = defaults, action = { type: false }) => {
  const { type, ...payload } = action
  switch (type) {
    case MOVE:
      return Object.assign(
        {},
        state,
        {
          board: [
            ...state.board.slice(0, payload.id),
            pegReducer(state.board[payload.id], action, state.whiteToMove),
            ...state.board.slice(payload.id + 1),
          ],
        },
        { whiteToMove: !state.whiteToMove },
      )

    case GAME_WON:
      const { winner, winningPegs } = payload
      return Object.assign({}, state, { winner, winningPegs })

    case RESET:
      return defaults

    default:
      return state
  }
}

export default gameReducer
