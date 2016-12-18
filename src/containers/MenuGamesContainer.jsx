require('./MenuGamesContainer.less');

import React, { Component } from 'react';
import { connect }          from 'react-redux';
// import cn                   from 'classnames';

// components
import TextButton from '../components/TextButton';

// actions
import { startGame } from '../actions/screenActions';

class MenuGames extends Component {
    onStartGameClick () {
        const { startGame } = this.props;

        startGame();
    }

    render () {
        return (
            <div className='menu-games-container'>
                <TextButton classes={['create-game']} onClick={()=>this.onStartGameClick()}>Create Game</TextButton>
            </div>
        );
    }
}

const MenuGamesContainer = connect( 
    null,
    dispatch => ({
        startGame: () => dispatch(startGame())
    })
)(MenuGames);

export default MenuGamesContainer;



