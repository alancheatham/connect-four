require('./MenuContainer.less');

import React, { Component } from 'react';
import { connect }          from 'react-redux';
// import cn                   from 'classnames';

// components
import TextButton from '../components/TextButton';
import Chat       from '../components/Chat'

class Menu extends Component {

    onButtonClick () {

    }

    render () {
        const { name } = this.props;

        return (
            <div className='menu-container'>
                <Chat name={name} />
                {/*<TextButton className='button' onClick={()=>this.onButtonClick()}>Enter</TextButton>*/}
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