import defaults from './defaults/userDefaults'

import { LOGIN } from '../actions/types/screenTypes'

const userReducer = (state = defaults, action = { type: false }) => {
  const { type, ...payload } = action
  switch (type) {
    case LOGIN:
      const { name } = payload
      return { name }

    default:
      return state
  }
}

export default userReducer
