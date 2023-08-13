require('./LoginContainer.less')

import React, { Component } from 'react'
import { connect } from 'react-redux'
// import cn                   from 'classnames';

// components
import TextButton from '../components/TextButton'

// actions
import { login } from '../actions/screenActions'

class Login extends Component {
  onLoginClick() {
    const { login } = this.props
    const { name } = this.refs

    login(name.value)
  }

  render() {
    return (
      <div className="login-container">
        <span className="name">Names</span>
        <input ref="name" className="input" />
        <TextButton className="button" onClick={() => this.onLoginClick()}>
          Enter
        </TextButton>
      </div>
    )
  }
}

const LoginContainer = connect(null, (dispatch) => ({
  login: (name) => dispatch(login(name)),
}))(Login)

export default LoginContainer
