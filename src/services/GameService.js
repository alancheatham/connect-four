import { gameWon, move } from '../actions/gameActions'

const qValues = JSON.parse(localStorage.getItem('qValues') || '{}')

class GameService {
  constructor(sandbox) {
    this.$ = sandbox

    this.initListeners()
  }

  initListeners() {
    const { $ } = this
    $.store.subscribe(() => this.handleStateChange())
  }

  bestMove() {
    const { board, whiteToMove } = this.$.store.getState().game

    const availablePegs = [
      0,
      1,
      2,
      3, //4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ].filter((i) => board[i].length < 4)

    const index = Math.floor(Math.random() * availablePegs.length)
    let nextMove = availablePegs[index]
    const newBoard = JSON.parse(JSON.stringify(board.slice(0, 4)))

    // look up q value for possible moves
    if (Math.random() > 0.5) {
      let bestQ = 0
      for (const peg of availablePegs) {
        let newestBoard = JSON.parse(JSON.stringify(newBoard))
        newestBoard[peg].push(whiteToMove ? 'W' : 'B')
        const qValue = qValues[JSON.stringify(newestBoard)]
        if (isNaN(qValue)) {
          continue
        }
        console.log('found!', qValue, newestBoard)
        if (whiteToMove) {
          if (qValue < bestQ) {
            bestQ = qValue
            nextMove = peg
          }
        } else {
          if (qValue > bestQ) {
            bestQ = qValue
            nextMove = peg
          }
        }
      }
    }
    this.$.store.dispatch(move(move))
  }

  handleStateChange() {
    const { $ } = this

    if ($.isGameOver) return

    const winnerInfo = this.checkIfGameWon()

    if (winnerInfo) {
      $.store.dispatch(gameWon(winnerInfo))
    }

    setTimeout(() => {
      this.bestMove()
    }, 100)
  }

  checkIfGameWon() {
    let winner = ''

    // same level
    winner = this.checkHorizontalPlanes()
    if (winner) return winner

    winner = this.checkVerticalPlanes()
    if (winner) return winner

    winner = this.checkDiagonalPlanes()
    if (winner) return winner

    // multi level
    winner = this.checkVerticalPegs()
    if (winner) return winner

    winner = this.checkHorizontalStairs()
    if (winner) return winner

    winner = this.checkVerticalStairs()
    if (winner) return winner

    winner = this.checkDiagonalStairs()
    if (winner) return winner

    if (this.checkIfBoardFull()) {
      return {
        winner: 'draw',
        winningPegs: [],
      }
    }

    return winner
  }

  checkIfBoardFull() {
    const { $ } = this
    const { board } = $.store.getState().game

    for (let i = 0; i < 4; i++) {
      if (board[i].length < 4) {
        return false
      }
    }

    return true
  }

  fourInARowHelper(currentBead, potentialWin, iteration) {
    if (!currentBead) {
      return false
    } else if (iteration === 0) {
      potentialWin.push(currentBead)
    } else {
      if (currentBead === potentialWin[iteration - 1]) {
        if (iteration === 3) {
          // game over
          return currentBead // 'W' or 'B'
        }
        potentialWin.push(currentBead)
      } else {
        return false
      }
    }
  }

  checkHorizontalPlanes() {
    const { $ } = this
    const { board } = $.store.getState().game

    let potentialWin = []

    // z axis
    for (let z = 0; z < 4; z++) {
      // y axis
      for (let y = 0; y < 4; y++) {
        // x axis
        for (let x = 0; x < 4; x++) {
          const currentPeg = y * 4 + x
          const currentBead = board[currentPeg][z]

          const winner = this.fourInARowHelper(currentBead, potentialWin, x)
          if (winner) {
            return {
              winner,
              winningPegs: [
                currentPeg,
                currentPeg - 1,
                currentPeg - 2,
                currentPeg - 3,
              ],
            }
          } else if (winner === false) {
            potentialWin = []
          }
        }
      }
    }
  }

  checkVerticalPlanes() {
    const { $ } = this
    const { board } = $.store.getState().game

    let potentialWin = []

    // z axis
    for (let z = 0; z < 4; z++) {
      // x axis
      for (let x = 0; x < 4; x++) {
        // x axis
        for (let y = 0; y < 4; y++) {
          const currentPeg = y * 4 + x
          const currentBead = board[currentPeg][z]

          const winner = this.fourInARowHelper(currentBead, potentialWin, y)
          if (winner) {
            return {
              winner,
              winningPegs: [
                currentPeg,
                currentPeg - 4,
                currentPeg - 8,
                currentPeg - 12,
              ],
            }
          } else if (winner === false) {
            potentialWin = []
          }
        }
      }
    }
  }

  checkDiagonalPlanes() {
    const { $ } = this
    const { board } = $.store.getState().game

    let potentialWin = []

    // z axis
    for (let z = 0; z < 4; z++) {
      // diagonal one
      for (let d1 = 0; d1 < 4; d1++) {
        const currentPeg = d1 * 5
        const currentBead = board[currentPeg][z]

        const winner = this.fourInARowHelper(currentBead, potentialWin, d1)
        if (winner) {
          return {
            winner,
            winningPegs: [0, 5, 10, 15],
          }
        } else if (winner === false) {
          potentialWin = []
        }
      }

      // diagonal two
      for (let d2 = 0; d2 < 4; d2++) {
        const currentPeg = d2 * 3 + 3
        const currentBead = board[currentPeg][z]

        const winner = this.fourInARowHelper(currentBead, potentialWin, d2)
        if (winner) {
          return {
            winner,
            winningPegs: [3, 6, 9, 12],
          }
        } else if (winner === false) {
          potentialWin = []
        }
      }
    }
  }

  checkVerticalPegs() {
    const { $ } = this
    const { board } = $.store.getState().game

    let potentialWin = []

    // y axis
    for (let y = 0; y < 4; y++) {
      // x axis
      for (let x = 0; x < 4; x++) {
        // z axis
        for (let z = 0; z < 4; z++) {
          const currentPeg = y * 4 + x
          const currentBead = board[currentPeg][z]

          const winner = this.fourInARowHelper(currentBead, potentialWin, z)
          if (winner) {
            return {
              winner,
              winningPegs: [currentPeg],
            }
          } else if (winner === false) {
            potentialWin = []
          }
        }
      }
    }
  }

  checkHorizontalStairs() {
    const { $ } = this
    const { board } = $.store.getState().game

    let potentialWin = []

    // y axis
    for (let y = 0; y < 4; y++) {
      // left to right
      for (let lr = 0; lr < 4; lr++) {
        const currentPeg = y * 4 + lr
        const currentBead = board[currentPeg][lr]

        const winner = this.fourInARowHelper(currentBead, potentialWin, lr)
        if (winner) {
          return {
            winner,
            winningPegs: [
              currentPeg,
              currentPeg - 1,
              currentPeg - 2,
              currentPeg - 3,
            ],
          }
        } else if (winner === false) {
          potentialWin = []
        }
      }

      // right to left
      for (let rl = 0; rl < 4; rl++) {
        const currentPeg = y * 4 + rl
        const currentBead = board[currentPeg][3 - rl]

        const winner = this.fourInARowHelper(currentBead, potentialWin, rl)
        if (winner) {
          return {
            winner,
            winningPegs: [
              currentPeg,
              currentPeg - 1,
              currentPeg - 2,
              currentPeg - 3,
            ],
          }
        } else if (winner === false) {
          potentialWin = []
        }
      }
    }
  }

  checkVerticalStairs() {
    const { $ } = this
    const { board } = $.store.getState().game

    let potentialWin = []

    // x axis
    for (let x = 0; x < 4; x++) {
      // up to down
      for (let ud = 0; ud < 4; ud++) {
        const currentPeg = ud * 4 + x
        const currentBead = board[currentPeg][ud]

        const winner = this.fourInARowHelper(currentBead, potentialWin, ud)
        if (winner) {
          return {
            winner,
            winningPegs: [
              currentPeg,
              currentPeg - 4,
              currentPeg - 8,
              currentPeg - 12,
            ],
          }
        } else if (winner === false) {
          potentialWin = []
        }
      }

      // down to up
      for (let du = 0; du < 4; du++) {
        const currentPeg = du * 4 + x
        const currentBead = board[currentPeg][3 - du]

        const winner = this.fourInARowHelper(currentBead, potentialWin, du)
        if (winner) {
          return {
            winner,
            winningPegs: [
              currentPeg,
              currentPeg - 4,
              currentPeg - 8,
              currentPeg - 12,
            ],
          }
        } else if (winner === false) {
          potentialWin = []
        }
      }
    }
  }

  checkDiagonalStairs() {
    const { $ } = this
    const { board } = $.store.getState().game

    let potentialWin = []

    // diagonal one
    for (let rl = 0; rl < 2; rl++) {
      for (let d1 = 0; d1 < 4; d1++) {
        const currentPeg = d1 * 5
        const currentBead =
          rl === 0 ? board[currentPeg][3 - d1] : board[currentPeg][d1]

        const winner = this.fourInARowHelper(currentBead, potentialWin, d1)
        if (winner) {
          return {
            winner,
            winningPegs: [0, 5, 10, 15],
          }
        } else if (winner === false) {
          potentialWin = []
        }
      }
    }

    // diagonal two
    for (let rl = 0; rl < 2; rl++) {
      for (let d2 = 0; d2 < 4; d2++) {
        const currentPeg = d2 * 3 + 3
        const currentBead =
          rl === 0 ? board[currentPeg][3 - d2] : board[currentPeg][d2]

        const winner = this.fourInARowHelper(currentBead, potentialWin, d2)
        if (winner) {
          return {
            winner,
            winningPegs: [3, 6, 9, 12],
          }
        } else if (winner === false) {
          potentialWin = []
        }
      }
    }
  }
}

export default GameService
