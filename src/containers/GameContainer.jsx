require('./GameContainer.less');

import React, { Component } from 'react';
import { connect }          from 'react-redux';
// import cn                   from 'classnames';

// components
import ConnectFourPeg from '../components/ConnectFourPeg';
import TextButton     from '../components/TextButton';

import { move, reset } from '../actions/gameActions';

// default state
const stateDefaults = {
	opponent: '',
	gameNumber: -1,
	white: false,
};

class Game extends Component {
	constructor(props) {
		super(props);
		socket.on('game started', game => this.gameStarted(game));
		socket.on('move', (game, id) => this.moveReceived(game, id));
		this.state = stateDefaults;
	}

	gameStarted (game) {
		const { name } = this.props;
		const { players, gameNumber } = game;

		if (name === players[0]) this.setState({ opponent: players[1], gameNumber, white: true });
		else if (name === players[1]) this.setState({ opponent: players[0], gameNumber, white: false });
	}

	moveReceived (game, id) {
		const { playMove } = this.props;
		const { gameNumber } = this.state;
		if (gameNumber !== game) return;
		playMove(id)
	}

	onPegClick (id) {
		const { board, winner, playMove, whiteToMove } = this.props;
		const { opponent, gameNumber, white } = this.state;

		if (white !== whiteToMove) return;

		if (winner || !opponent) return;

		if (board[id].length > 3) return;

		// playMove(id);
		socket.emit('move', gameNumber, id);
	}

	resetGame () {
		const { resetGame } = this.props;
		resetGame();
	}

	renderRow () {
		const { winningPegs, winner} = this.props;

		const pegs = [];
		for (let i = 0; i < 4; i++) {
			// losing pegs (not included in winning 4 in a row)
			const loser = (winner) ? winningPegs.indexOf(this.pegKey) === -1 : false;

			pegs.push(<ConnectFourPeg loser={loser} beads={this.props.board[this.pegKey]} key={this.pegKey} id={this.pegKey++} onClick={id => this.onPegClick(id)} />)
		}

		return (
			<div key={this.rowKey++} className='row'>
				{pegs}
			</div>
		);
	}

	renderGrid () {
		const rows = [];
		for (let i = 0; i < 4; i++) {
			rows.push(this.renderRow());
		}

		return (
			<div className='grid'>
				{rows}
			</div>
		);
	}

	renderGameEnd (winner) {
		let winnerText;
		let winnerTextClasses = ['winner-text'];

		if (winner === 'W') {
			winnerText = 'White wins!';
			winnerTextClasses.push('white');
		}

		else {
			winnerText = 'Black wins!';
		}

		return (
			<div className='end'> 
				<TextButton classes={winnerTextClasses}>{winnerText}</TextButton> 
				<TextButton classes={['play-again']} onClick={() => this.resetGame()}>Play again</TextButton>
			</div>
		);
	}

	renderOpponent () {
		const { opponent } = this.state
		let opponentText = `Opponent: ${opponent}` || 'Waiting for Opponent';

		return <div className='opponent'>{opponentText}</div>;
	}

	renderYourTurn () {
		const { whiteToMove } = this.props;
		const { white }	 	  = this.state;

		let turnText = 'Your Turn'
		if (whiteToMove !== white) turnText = 'Opponent\'s turn';

		return <div className='turn-text'>{turnText}</div>
	}

	render () {
		const { winner } = this.props;

		this.pegKey = 0;
		this.rowKey = 0;

		return (
			<div className='game'>
				{this.renderGrid()}
				{winner ? this.renderGameEnd(winner) : null}
				{this.renderOpponent()}
				{this.renderYourTurn()}
			</div>		
		);
	}
}

const GameContainer = connect(
	state => {
		const { board, winner, winningPegs, whiteToMove } = state.game;
		const { name } = state.user;

		return { board, winner, winningPegs, name, whiteToMove };
	},
	dispatch => ({
		playMove:  id => dispatch(move(id)),
		resetGame: () => dispatch(reset())
	})
)(Game);

export default GameContainer;