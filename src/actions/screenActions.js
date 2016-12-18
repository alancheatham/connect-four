import { LOGIN, START_GAME } from './types/screenTypes';

export const login = (name = '') => ({
    type: LOGIN,
    name
});