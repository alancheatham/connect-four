require('./MenuContainer.less');

import React, { Component } from 'react';
import { connect }          from 'react-redux';
// import cn                   from 'classnames';

// components
import TextButton from '../components/TextButton';
import Chat       from '../components/Chat'

// actions
import { startGame } from '../actions/screenActions';

class Menu extends Component {

    onStartGameClick () {
        const { startGame } = this.props;

        startGame();
    }

    render () {
        const { name } = this.props;

        return (
            <div className='menu-container'>
                <Chat name={name} />
                <TextButton classes={['create-game']} onClick={()=>this.onStartGameClick()}>Create Game</TextButton>
            </div>
        );
    }
}

const MenuContainer = connect( 
    state => {
        const { name } = state.user;

        return { name };
    },
    dispatch => ({
        startGame: () => dispatch(startGame())
    })
)(Menu);

export default MenuContainer;