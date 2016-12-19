require('./MenuGamesContainer.less');

import React, { Component } from 'react';
import { connect }          from 'react-redux';
// import cn                   from 'classnames';

// components
import TextButton from '../components/TextButton';

// actions
import { startGame } from '../actions/screenActions';

// default state
const defaultState = {
    games: []
};

class MenuGames extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState;

        socket.emit('get open games');
        socket.on('get open games', games => this.populateGames(games));
        socket.on('open games update', games => this.updateOpenGames(games));
    }

    populateGames (games) {
        this.setState({ games });
    }

    updateOpenGames (games) {
        this.setState({ games });
    }

    renderGame (game, key) {
        return (
            <li key={key}>
                {game}
                <TextButton classes={['join-game']} onClick={()=>this.onJoinGameClicked()}>Join</TextButton>
            </li>
        );
    }

    onStartGameClick () {
        const { startGame } = this.props;

        socket.emit('create game');
        startGame();
    }

    render () {
        const { games } = this.state;

        let n = 0;
        return (
            <div className='menu-games-container'>
                <TextButton classes={['create-game']} onClick={()=>this.onStartGameClick()}>Create Game</TextButton>
                <ul className='game-list'>
                    { 
                        games.map(game => {
                            return this.renderGame(game, n++);
                        })
                    }
                </ul>
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



