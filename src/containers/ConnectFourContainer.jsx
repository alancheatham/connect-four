require('./ConnectFourContainer.less')

import React, { Component } from 'react'
import { connect } from 'react-redux'
// import cn                   from 'classnames';

// containers
import LoginContainer from './LoginContainer'
import GameContainer from './GameContainer'
import MenuContainer from './MenuContainer'

// constants
import {
  LOGIN_SCREEN,
  MENU_SCREEN,
  GAME_SCREEN,
} from '../constants/screenConstants'

const LoginPane = () => {
  return <LoginContainer />
}

const MenuPane = () => {
  return <MenuContainer />
}

const GamePane = (sandbox) => {
  return <GameContainer sandbox={sandbox} solo={true} />
}

class ConnectFour extends Component {
  render() {
    const { screen, sandbox } = this.props

    switch (screen) {
      case LOGIN_SCREEN:
        return LoginPane()

      case MENU_SCREEN:
        return MenuPane()

      case GAME_SCREEN:
        return GamePane(sandbox)

      default:
        return <div>Error</div>
    }
  }
}

const ConnectFourContainer = connect(
  (state) => {
    const { screen } = state

    return { screen }
  },
  null,
  // dispatch => ({
  //     // playMove:  id => dispatch(move(id)),
  //     // resetGame: () => dispatch(reset())
  // })
)(ConnectFour)

export default ConnectFourContainer
