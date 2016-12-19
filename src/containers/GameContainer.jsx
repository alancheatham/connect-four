require('./GameContainer.less');

import React, { Component } from 'react';
import { connect }          from 'react-redux';
// import cn                   from 'classnames';

// components
import ConnectFourPeg from '../components/ConnectFourPeg';
import TextButton     from '../components/TextButton';

import { move, reset } from '../actions/gameActions';

class Game extends Component {

	onPegClick (id) {
		const { board, winner, opponent, playMove } = this.props;

		if (winner || !opponent) return;

		if (board[id].length > 3) return;

		playMove(id);
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
		const { opponent } = this.props;
		let opponentText = opponent || 'Waiting for Opponent';

		return <div className='opponent'>{opponentText}</div>;
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
			</div>		
		);
	}
}

const GameContainer = connect(
	state => {
		const { board, winner, winningPegs, opponent } = state.game;

		return { board, winner, winningPegs };
	},
	dispatch => ({
		playMove:  id => dispatch(move(id)),
		resetGame: () => dispatch(reset())
	})
)(Game);

export default GameContainer;