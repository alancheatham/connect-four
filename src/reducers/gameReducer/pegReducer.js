import { MOVE } from '../../actions/types/gameTypes';
import defaults from '../defaults/gameDefaults/pegDefaults';

const pegReducer = (state = defaults, action = { type: false }, whiteToMove = true) => {
	const { type, ...payload } = action;
	switch (type) {
		case MOVE:
			return [...state, whiteToMove ? 'W' : 'B'];

		default:
			return state;
	}
};

export default pegReducer;