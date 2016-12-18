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
        socket.on('chat update', msg => this.onChatMessage(msg));
        this.enterChat();
    }

    onChatMessage (msg) {
        this.setState({ messages: msg });
    }

    enterChat () {
        const { name }  = this.props;

        socket.emit('chat update', [...this.state.messages, `${name} entered chat`]);
    }

    onEnterClick () {
        const { name }  = this.props;
        const { input } = this.refs;

        socket.emit('chat update', [...this.state.messages, `${name}: ${input.value}`]);
        input.value = '';
    }

    render () {
        let n = 0;
        return (
            <div className='chat-container'>
                <ul ref='chat' className='chat'>
                    {this.state.messages.map(message => {
                        return <li key={n++}>{message}</li>
                    })}
                </ul>
                <input ref='input' className='input' />
                <TextButton classes={['enter']} onClick={()=>this.onEnterClick()}>Enter</TextButton>
            </div>
        );
    }
}

export default Chat;