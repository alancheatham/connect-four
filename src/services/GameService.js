import { gameWon, move, reset } from '../actions/gameActions'
import qValues from '../data/qValues.json'
// import * as tf from '@tensorflow/tfjs'

// const qValues = require('../data/qValues.json')
let whiteCount = 0

const MODE_TRAIN = false
const TRAIN_NEW = false

const GAME_COUNT = 1000
const learningRate = 0.005
let model

if (TRAIN_NEW) {
  model = tf.sequential()

  model.add(
    tf.layers.dense({
      inputShape: 64,
      units: 128,
      activation: 'relu',
    }),
  )

  model.add(
    tf.layers.dense({
      units: 128,
      activation: 'relu',
    }),
  )

  model.add(
    tf.layers.dense({
      units: 16,
      activation: 'softmax',
    }),
  )

  model.compile({
    optimizer: tf.train.adam(learningRate),
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy'],
  })
} else {
  tf.loadLayersModel('localstorage://my-model-1').then((loadedModel) => {
    model = loadedModel
    model.compile({
      optimizer: tf.train.adam(learningRate),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy'],
    })
    console.log('loaded', model)
  })
}

let count = 0
let easy = false

const EXPLORATION_RATE = 0.1
class GameService {
  constructor(sandbox) {
    this.$ = sandbox

    this.initListeners()

    if (MODE_TRAIN) {
      this.moveFindWinWontLose()
    }
  }

  initListeners() {
    const { $ } = this
    $.store.subscribe(() => this.handleStateChange())
  }

  moveFindWinWontLose() {
    const { board, whiteToMove } = this.$.store.getState().game

    const availablePegs = [
      0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
    ].filter((i) => board[i].findIndex((x) => x === 0) > -1)

    const index = Math.floor(Math.random() * availablePegs.length)
    // let nextMove
    let nextMove = availablePegs[index]
    // const newBoard = JSON.parse(JSON.stringify(board.slice(0, 4)))
    for (const peg of availablePegs) {
      // check for white win
      let newestBoard = JSON.parse(JSON.stringify(board))
      let index = newestBoard[peg].indexOf(0)
      newestBoard[peg][index] = 1
      let winnerInfo = this.checkIfGameWon(newestBoard)
      if (winnerInfo) {
        const winner = winnerInfo.winner
        if (winner === 'W') {
          nextMove = peg
          break
        }
      }

      // prevent black win
      newestBoard = JSON.parse(JSON.stringify(board))
      index = newestBoard[peg].indexOf(0)
      newestBoard[peg][index] = -1
      winnerInfo = this.checkIfGameWon(newestBoard)
      if (winnerInfo) {
        const winner = winnerInfo.winner
        if (winner === 'B') {
          nextMove = peg
          break
        }
      }
    }
    if (!isNaN(nextMove)) {
      // console.log('playing', nextMove)
      this.$.store.dispatch(move(nextMove))
    } else {
      this.neuralMove()
    }
  }

  neuralMove() {
    const { board } = this.$.store.getState().game

    const tenseBlock = tf.tensor([
      board /*.slice(0, 4).*/
        .flat(),
    ])
    const result = model.predict(tenseBlock)
    const flatty = result.flatten()
    const maxy = flatty.argMax()
    maxy.data().then((m) => {
      flatty.data().then((allMoves) => {
        flatty.dispose()
        tenseBlock.dispose()
        result.dispose()
        maxy.dispose()
        console.log(allMoves)
        console.log(m[0])
        if (board[m[0]].findIndex((x) => x === 0) > -1) {
          this.$.store.dispatch(move(m[0]))
        } else {
          // console.log('illegal move')
          this.moveFindWinWontLose()
        }
      })
    })
  }

  getAvailablePegs(board) {
    return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].filter(
      (i) => board[i].findIndex((x) => x === 0) > -1,
    )
  }

  topMinimax() {
    const { board, whiteToMove } = this.$.store.getState().game

    const availablePegs = this.getAvailablePegs(board)
    let aboutToLose = false
    let bestMove
    let score = whiteToMove ? -Infinity : Infinity
    let value = 0

    debugger
    for (const peg of availablePegs) {
      const newBoard = JSON.parse(JSON.stringify(board))
      const index = newBoard[peg].indexOf(0)
      newBoard[peg][index] = whiteToMove ? 1 : -1

      value = this.minimax(newBoard, 3, !whiteToMove)
      console.log(value)

      if (whiteToMove) {
        // win
        if (value === 1) {
          this.$.store.dispatch(move(peg))
          return
        }
        if (value > score) {
          bestMove = peg
          score = value
        }
      } else {
        // win
        if (value === -1) {
          this.$.store.dispatch(move(peg))
          return
        }
        if (value < score) {
          bestMove = peg
          score = value
        }
      }
    }

    if (bestMove) {
      this.$.store.dispatch(move(bestMove))
      return
    }

    // play random move
    this.moveFindWinWontLose()
  }

  minimax(board, depth, isMaximizingPlayer) {
    let value = 0

    // check for  win
    let winnerInfo = this.checkIfGameWon(board)
    if (winnerInfo) {
      if (winnerInfo.winner === 'W') {
        return 1
      }
      if (winnerInfo.winner === 'B') {
        return -1
      } else {
        return 0
      }
    }

    if (depth === 0) {
      return 0
    }

    const availablePegs = this.getAvailablePegs(board)
    if (isMaximizingPlayer) {
      value = -Infinity

      for (const peg of availablePegs) {
        const nextIndex = board[peg].indexOf(0)

        const newBoard = JSON.parse(JSON.stringify(board))
        newBoard[peg][nextIndex] = 1

        value = Math.max(value, this.minimax(newBoard, depth - 1, false))
      }

      return value
    } else {
      value = Infinity

      for (const peg of availablePegs) {
        const nextIndex = board[peg].indexOf(0)

        const newBoard = JSON.parse(JSON.stringify(board))
        newBoard[peg][nextIndex] = -1

        value = Math.min(value, this.minimax(newBoard, depth - 1, true))
      }

      return value
    }
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
    const newBoard = JSON.parse(JSON.stringify(board /*.slice(0, 4)*/))

    // look up q value for possible moves
    if (Math.random() > EXPLORATION_RATE) {
      let bestQ = 0
      for (const peg of availablePegs) {
        let newestBoard = JSON.parse(JSON.stringify(newBoard))
        newestBoard[peg].push(whiteToMove ? 1 : 0)
        const qValue = qValues[JSON.stringify(newestBoard)]
        if (isNaN(qValue)) {
          continue
        }
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
    this.$.store.dispatch(move(nextMove))
  }

  downloadObjectAsJson(exportObj, exportName) {
    var dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(exportObj))
    var downloadAnchorNode = document.createElement('a')
    downloadAnchorNode.setAttribute('href', dataStr)
    downloadAnchorNode.setAttribute('download', exportName + '.json')
    document.body.appendChild(downloadAnchorNode) // required for firefox
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  propogateQValues(winner) {
    const { moves } = this.$.store.getState().game
    const newMoves = moves.map((move) => move /*.slice(0, 4)*/)
    if (winner === 'B') {
      qValues[JSON.stringify(newMoves[newMoves.length - 1])] = 1
    } else if (winner === 'W') {
      qValues[JSON.stringify(newMoves[newMoves.length - 1])] = -1
    } else {
      qValues[JSON.stringify(newMoves[newMoves.length - 1])] = 0
    }
    for (let i = newMoves.length - 2; i >= 0; i--) {
      if (!qValues[JSON.stringify(newMoves[i])]) {
        qValues[JSON.stringify(newMoves[i])] = 0
      }
      qValues[JSON.stringify(newMoves[i])] =
        0.5 * qValues[JSON.stringify(newMoves[i])] +
        0.5 * qValues[JSON.stringify(newMoves[i + 1])]
    }
    // console.log(qValues)
  }

  flipX(board) {
    const newBoard = JSON.parse(JSON.stringify(board))
    for (let i = 0; i < 4; i++) {
      newBoard[i] = board[3 - i]
    }
    return newBoard
  }

  // Creates a 1 shot of the diff
  nextMove(first, second) {
    const result = []
    first.flat().forEach((move, i) => {
      result.push(Math.abs(move - second.flat()[i]))
    })
    // unflatten
    const newResult = []
    for (let i = 0; i < 16; i++) {
      newResult.push(result.slice(i * 4, i * 4 + 4))
    }
    return newResult.map((peg) => (peg.includes(1) ? 1 : 0))
  }

  getMirrorMoves(moves) {
    const x = []
    const y = []
    // Make all the moves
    for (let i = 0; i < moves.length - 1; i++) {
      const theMove = this.nextMove(moves[i], moves[i + 1])
      // Normal move
      x.push(moves[i].flat())
      y.push(theMove.flat())
      // Flipped X move
      // x.push(this.flipX(moves[i]).flat())
      // y.push(this.flipX(theMove).flat())

      // Inverted Move
      // x.push(moves[i].slice().reverse())
      // y.push(theMove.slice().reverse())
      // // Flipped Y move
      // x.push(flipY(moves[i]))
      // y.push(flipY(theMove))
    }
    return { x, y }
  }

  handleStateChange() {
    const { $ } = this
    const { whiteToMove, moves, board } = this.$.store.getState().game

    if ($.isGameOver) return

    const winnerInfo = this.checkIfGameWon()

    if (winnerInfo && winnerInfo.winner !== 'draw') {
      console.log(count, winnerInfo.winner)
      if (winnerInfo.winner === 'W') {
        whiteCount++
      }
      if (count % 100 === 0) {
        console.log('rate over last 100', whiteCount / 100)
        whiteCount = 0
      }
      if (count % 1000 === 0) {
        console.log(count, winnerInfo.winner)
      }
      let adjustedMoves = [...moves]
      if (winnerInfo.winner === 'B') {
        adjustedMoves = moves.map((move) =>
          move.map((m) => m.map((n) => (n == 0 ? n : -n))),
        )
      }
      // console.log(adjustedMoves)

      let allMoves = {
        x: this.getMirrorMoves(
          adjustedMoves /*.map((m) => m.slice(0, 4))*/,
        ).x.filter((x, i) => {
          if (winnerInfo.winner === 'B') {
            // return i % 4 === 0 || i % 4 === 1
            return i % 2 === 0
          } else {
            // return i % 4 === 2 || i % 4 === 3
            return i % 2 === 1
          }
        }),
        y: this.getMirrorMoves(
          adjustedMoves /*.map((m) => m.slice(0, 4))*/,
        ).y.filter((x, i) => {
          if (winnerInfo.winner === 'B') {
            // return i % 4 === 0 || i % 4 === 1
            return i % 2 === 0
          } else {
            // return i % 4 === 2 || i % 4 === 3
            return i % 2 === 1
          }
        }),
      }
      // console.log(allMoves)

      // this.trainOnGames([allMoves])
      $.store.dispatch(gameWon(winnerInfo))
      // this.propogateQValues(winnerInfo.winner)

      if (++count === GAME_COUNT) {
        console.log('saving...')
        model.save('localstorage://my-model-1')
        // localStorage.setItem('qValues', JSON.stringify(qValues))
        // this.downloadObjectAsJson(qValues, 'qValues')
        console.log('done')
      } else if (count % 1000 === 0) {
        console.log('saving...')
        model.save('localstorage://my-model-1')
      } else {
        setTimeout(() => {
          // $.store.dispatch(reset())
        }, 0)
      }
      return
    } else if (winnerInfo && winnerInfo.winner === 'draw') {
      // $.store.dispatch(gameWon(winnerInfo))
      setTimeout(() => {
        $.store.dispatch(reset())
      }, 0)
      return
    }

    if (whiteToMove) {
      // this.bestMove()
      // setTimeout(() => this.neuralMove(), 1000)
      if (MODE_TRAIN) {
        this.moveFindWinWontLose()
      } else {
        // this.neuralMove()
        this.topMinimax()
      }
    } else {
      if (MODE_TRAIN) {
        this.moveFindWinWontLose()
      }
      // setTimeout(() => this.moveFindWinWontLose(), 1000)
    }
    // this.moveFindWinWontLose()
    // this.bestMove()
  }
  trainOnGames(games) {
    // console.log('training')
    // model.dispose();
    let AllX = []
    let AllY = []

    // console.log("Games in", JSON.stringify(games));
    games.forEach((game) => {
      AllX = AllX.concat(game.x)
      AllY = AllY.concat(game.y)
    })
    // console.log(AllX, AllY)

    // Tensorfy!
    const stackedX = tf.stack(AllX)
    const stackedY = tf.stack(AllY)
    this.trainModel(model, stackedX, stackedY)

    // clean up!
    // stackedX.dispose()
    // stackedY.dispose()

    // setState(model)
    // return updatedModel;
  }

  trainModel(model, stackedX, stackedY) {
    const allCallbacks = {
      // onTrainBegin: log => console.log(log),
      // onTrainEnd: log => console.log(log),
      // onEpochBegin: (epoch, log) => console.log(epoch, log),
      // onEpochEnd: (epoch, log) => console.log(epoch, log),
      // onBatchBegin: (batch, log) => console.log(batch, log),
      // onBatchEnd: (batch, log) => console.log(batch, log)
    }

    model
      .fit(stackedX, stackedY, {
        epochs: 1,
        shuffle: true,
        batchSize: 32,
        callbacks: allCallbacks,
      })
      .then(() => {
        if (count <= GAME_COUNT) {
          this.$.store.dispatch(reset())
        }
      })

    // console.log('Model Trained')

    return model
  }

  checkIfGameWon(board) {
    let winner = ''
    if (!board) {
      board = this.$.store.getState().game.board
    }

    // same level
    winner = this.checkHorizontalPlanes(board)
    if (winner) return winner

    winner = this.checkVerticalPlanes(board)
    if (winner) return winner

    winner = this.checkDiagonalPlanes(board)
    if (winner) return winner

    // multi level
    winner = this.checkVerticalPegs(board)
    if (winner) return winner

    winner = this.checkHorizontalStairs(board)
    if (winner) return winner

    winner = this.checkVerticalStairs(board)
    if (winner) return winner

    winner = this.checkDiagonalStairs(board)
    if (winner) return winner

    if (this.checkIfBoardFull(board)) {
      return {
        winner: 'draw',
        winningPegs: [],
      }
    }

    return winner
  }

  checkIfBoardFull(board) {
    for (let i = 0; i < 4; i++) {
      if (board[i].findIndex((x) => x === 0) > -1) {
        return false
      }
    }

    return true
  }

  fourInARowHelper(currentBead, potentialWin, iteration) {
    if (currentBead === 0) {
      return false
    } else if (iteration === 0) {
      potentialWin.push(currentBead)
    } else {
      if (currentBead === potentialWin[iteration - 1]) {
        if (iteration === 3) {
          // game over
          return currentBead == 1 ? 'W' : 'B'
        }
        potentialWin.push(currentBead)
      } else {
        return false
      }
    }
  }

  checkHorizontalPlanes(board) {
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

  checkVerticalPlanes(board) {
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

  checkDiagonalPlanes(board) {
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

  checkVerticalPegs(board) {
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

  checkHorizontalStairs(board) {
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

  checkVerticalStairs(board) {
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

  checkDiagonalStairs(board) {
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
