require('./Chat.less');

import React, { Component } from 'react';
// import cn                   from 'classnames';

// components
import TextButton from './TextButton';

// default state
const defaultState = {
    messages: [],
    users:    []
};

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = defaultState;
        
        socket.on('chat update', msg => this.onChatMessage(msg));
        socket.on('user chat update', users => this.onUserUpdate(users));
        this.enterChat();
    }

    enterChat () {
        const { name } = this.props;

        socket.emit('user chat update', name, true);
    }   

    onChatMessage (msg) {
        const { messages } = this.state;
        this.setState({ messages: [...messages, msg ] });
    }

    onUserUpdate (users) {
        this.setState({ users });
    }

    onEnterClick () {
        const { name }  = this.props;
        const { input } = this.refs;

        socket.emit('chat update', `${name}: ${input.value}`);
        input.value = '';
    }

    render () {
        const { messages, users } = this.state;

        let n = 0;
        return (
            <div className='chat-container'>
                <ul className='chat'>
                    {messages.map(message => {
                        return <li key={n++}>{message}</li>
                    })}
                </ul>
                <ul className='users'>
                    {users.map(user => {
                        return <li key={n++}>{user}</li>
                    })}
                </ul>
                <input ref='input' className='input' />
                <TextButton classes={['enter']} onClick={()=>this.onEnterClick()}>Enter</TextButton>
            </div>
        );
    }
}

export default Chat;