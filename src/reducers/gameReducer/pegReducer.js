import { MOVE } from '../../actions/types/gameTypes'
import defaults from '../defaults/gameDefaults/pegDefaults'

const pegReducer = (
  state = defaults,
  action = { type: false },
  whiteToMove = true,
) => {
  const { type, ...payload } = action
  switch (type) {
    case MOVE:
      const index = state.indexOf(0)
      const newState = [...state]
      newState[index] = whiteToMove ? 1 : -1
      return newState

    default:
      return state
  }
}

export default pegReducer
