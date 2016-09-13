import {
	MOVE,
	GAME_WON,
	RESET
} from './types/gameTypes';

export const move = (id = 0) => ({
	type: MOVE,
	id
});

export const gameWon = ({ winner = '', winningPegs = [] }) => ({
	type: GAME_WON,
	winner,
	winningPegs
});

export const reset = () => ({
	type: RESET
});