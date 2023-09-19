require('./GameContainer.less')

import React, { Component } from 'react'
import { connect } from 'react-redux'
// import cn                   from 'classnames';

// components
import ConnectFourPeg from '../components/ConnectFourPeg'
import TextButton from '../components/TextButton'

import {
  move,
  reset,
  setBoard,
  resetWinner,
  setWhiteToMove,
} from '../actions/gameActions'

let counter = 0

// default state
const stateDefaults = {
  opponent: '',
  gameNumber: -1,
  white: false,
  solo: false,
  qValues: JSON.parse(localStorage.getItem('qValues') || '{}'),
  mounted: false,
  minimax: false,
}

const scores = {
  W: 1,
  B: -1,
  draw: 0,
}

class Game extends Component {
  constructor(props) {
    super(props)
    if (!props.solo) {
      socket.on('game started', (game) => this.gameStarted(game))
      socket.on('move', (game, id) => this.moveReceived(game, id))
    } else {
      stateDefaults.solo = true
      stateDefaults.opponent = 'Computer'
      stateDefaults.name = 'You'

      this.gameStarted({ players: ['You', 'Computer'], gameNumber: 0 })
    }
    this.state = stateDefaults
  }
  gameStarted(game) {
    const { name = 'You' } = this.props
    const { players, gameNumber } = game

    if (name === players[0])
      this.setState({ opponent: players[1], gameNumber, white: true })
    else if (name === players[1])
      this.setState({ opponent: players[0], gameNumber, white: false })
  }
  moveReceived(game, id) {
    const { playMove } = this.props
    const { gameNumber } = this.state
    if (gameNumber !== game) return
    playMove(id)
  }
  minimax(depth, isMaximizingPlayer) {
    const { winner, board, playMove, setBoard, resetWinner, setWhiteToMove } =
      this.props

    if (winner) {
      return scores[winner]
    }

    if (depth > 4) {
      return 0
    }

    if (isMaximizingPlayer) {
      let bestScore = -Infinity
      for (let i = 0; i < 4; i++) {
        // available?
        if (board[i].length === 4) {
          continue
        }

        let oldBoard = [...board]
        playMove(i)
        let score = this.minimax(depth + 1, false)
        setBoard(oldBoard)
        resetWinner()
        setWhiteToMove(true)
        bestScore = Math.max(score, bestScore)
      }

      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < 4; i++) {
        // available?
        if (this.props.board[i].length === 4) {
          continue
        }

        let oldBoard = [...board]
        playMove(i)
        let score = this.minimax(depth + 1, true)
        setBoard(oldBoard)
        resetWinner()
        setWhiteToMove(false)
        bestScore = Math.min(score, bestScore)
      }
      return bestScore
    }
  }
  bestMove() {
    const {
      playMove,
      setBoard,
      winner,
      resetWinner,
      board,
      setWhiteToMove,
      whiteToMove,
    } = this.props
    const { qValues } = this.state
    if (winner) return

    let bestScore = -Infinity
    let move
    let aboutToLose = false

    for (let i = 0; i < 4; i++) {
      // available?
      if (this.props.board[i].length === 4) {
        continue
      }

      let oldBoard = [...board]
      playMove(i)
      let score = this.minimax(0, false)
      setBoard(oldBoard)
      resetWinner()
      setWhiteToMove(true)

      if (score === -1) {
        aboutToLose = true
      }

      if (score > bestScore) {
        bestScore = score
        move = i
      }
    }

    if (bestScore === 0 && !aboutToLose) {
      // random move
      const availablePegs = [
        0,
        1,
        2,
        3, //4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
      ].filter((i) => board[i].length < 4)
      const index = Math.floor(Math.random() * availablePegs.length)
      move = availablePegs[index]
    }

    playMove(move)
  }
  onPegClick(id) {
    const { board, winner, playMove, whiteToMove } = this.props
    const { opponent, gameNumber, white, solo } = this.state

    // if (white !== whiteToMove) return

    if (winner || !opponent) return

    if (board[id].findIndex((x) => x === 0) === -1) return

    if (solo) {
      playMove(id)
      // setTimeout(() => this.bestMove(), 100)
      return
    } else {
      socket.emit('move', gameNumber, id)
    }
  }
  resetGame() {
    const { resetGame } = this.props
    resetGame()
  }
  renderRow() {
    const { winningPegs, winner } = this.props

    const pegs = []
    for (let i = 0; i < 4; i++) {
      // losing pegs (not included in winning 4 in a row)
      const loser = winner ? winningPegs.indexOf(this.pegKey) === -1 : false

      pegs.push(
        <ConnectFourPeg
          loser={loser}
          beads={this.props.board[this.pegKey]}
          key={this.pegKey}
          id={this.pegKey++}
          onClick={(id) => this.onPegClick(id)}
        />,
      )
    }
    return (
      <div key={this.rowKey++} className="row">
        {pegs}
      </div>
    )
  }
  renderGrid() {
    const rows = []
    for (let i = 0; i < 1; i++) {
      rows.push(this.renderRow())
    }
    return <div className="grid">{rows}</div>
  }
  renderGameEnd(winner) {
    let winnerText
    let winnerTextClasses = ['winner-text']

    if (winner === 'W') {
      winnerText = 'White wins!'
      winnerTextClasses.push('white')
    } else if (winner === 'B') {
      winnerText = 'Black wins!'
    } else {
      winnerText = 'Draw!'
    }
    return (
      <div className="end">
        <TextButton classes={winnerTextClasses}>{winnerText}</TextButton>
        <TextButton classes={['play-again']} onClick={() => this.resetGame()}>
          Play again
        </TextButton>
      </div>
    )
  }
  renderOpponent() {
    const { opponent } = this.state
    let opponentText = `Opponent: ${opponent}` || 'Waiting for Opponent'

    return <div className="opponent">{opponentText}</div>
  }
  renderYourTurn() {
    const { whiteToMove } = this.props
    const { white } = this.state

    let turnText = 'Your Turn'
    if (whiteToMove !== white) turnText = "Opponent's turn"

    return <div className="turn-text">{turnText}</div>
  }
  render() {
    const { winner } = this.props

    this.pegKey = 0
    this.rowKey = 0

    return (
      <div className="game" onClick={() => {} /*this.bestMove()*/}>
        {this.renderGrid()}
        {winner ? this.renderGameEnd(winner) : null}
        {/* {this.renderOpponent()}
        {this.renderYourTurn()} */}
      </div>
    )
  }
}

const GameContainer = connect(
  (state) => {
    const { board, winner, winningPegs, whiteToMove, moves } = state.game
    const { name } = state.user

    return { board, winner, winningPegs, name, whiteToMove, moves }
  },
  (dispatch) => ({
    playMove: (id) => dispatch(move(id)),
    resetGame: () => dispatch(reset()),
    setBoard: (board) => dispatch(setBoard(board)),
    resetWinner: () => dispatch(resetWinner()),
    setWhiteToMove: (whiteToMove) => dispatch(setWhiteToMove(whiteToMove)),
  }),
)(Game)

export default GameContainer
