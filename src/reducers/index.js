import { combineReducers } from 'redux';

import game   from './gameReducer';
import screen from './screenReducer';
import user   from './userReducer';

const rootReducer = combineReducers({
    screen,
	game,
    user
});

export default rootReducer;