require('./MenuContainer.less');

import React, { Component } from 'react';
import { connect }          from 'react-redux';
// import cn                   from 'classnames';

// containers
import MenuGamesContainer from './MenuGamesContainer';

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
                <MenuGamesContainer />
            </div>
        );
    }
}

const MenuContainer = connect( 
    state => {
        const { name } = state.user;

        return { name };
    },
    null
)(Menu);

export default MenuContainer;