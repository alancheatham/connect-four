import defaults from './defaults/screenDefaults';

import { 
    LOGIN,
    START_GAME
} from '../actions/types/screenTypes';

import {
    LOGIN_SCREEN,
    MENU_SCREEN,
    GAME_SCREEN
} from '../constants/screenConstants';

const screenReducer = (state = defaults, action = { type: false }) => {
    const { type, ...payload } = action;
    switch (type) {
        case LOGIN:
            const { name } = payload;
            return MENU_SCREEN;

        default:
            return state;
    }
};

export default screenReducer;