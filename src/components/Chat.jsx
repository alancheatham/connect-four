require('./Chat.less');

import React, { Component } from 'react';
// import cn                   from 'classnames';

// components
import TextButton from './TextButton';

// default state
const defaultState = {
    messages: []
};

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = defaultState;
    }

    onEnterClick () {
        const { input } = this.refs;

        this.setState({ messages: [...this.state.messages, input.value] })
        input.value = '';
    }

    render () {
        const { name } = this.props;

        let n = 0;
        return (
            <div className='chat-container'>
                <ul ref='chat' className='chat'>
                    {this.state.messages.map(message => {
                        return <li key={n++}>{`${name}: ${message}`}</li>
                    })}
                </ul>
                <input ref='input' className='input' />
                <TextButton onClick={()=>this.onEnterClick()}>Enter</TextButton>
            </div>
        );
    }
}

export default Chat;