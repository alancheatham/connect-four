// dependencies
import React           from 'react';
import ReactDOM        from 'react-dom';
import { Provider }    from 'react-redux';
import { createStore } from 'redux';

// containers
import ConnectFourContainer from './containers/ConnectFourContainer';

// root reducer
import rootReducer from './reducers/index';

// services
import GameService from './services/GameService';

const initStore = () => {
	const store = createStore(
	    // root reducer
	    rootReducer,

	    // dev tools
	    window.devToolsExtension ? window.devToolsExtension() : undefined,
	);

	if (module.hot) {
	    module.hot.accept('./reducers/index', () =>
	        store.replaceReducer(require('./reducers/index').default)
	    );
	}

	return store;
};

const initRender = sandbox => {
	const el = sandbox.renderTarget;

	if (!el) {
		console.log('no render target');
		return;
	}

	ReactDOM.render(
	    <Provider store={sandbox.store}>
	        <ConnectFourContainer sandbox={sandbox} />
	    </Provider>,
	    el
	);
};

const initServices = sandbox => {
	new GameService(sandbox);
}

// private properties
let store;

class Sandbox {
	constructor (framework, opt) {
		this.$   = framework;
		this.opt = opt;

		store = initStore(this);
		initRender(this);
		initServices(this);
	}

	get store () {
		return store;
	}

	get renderTarget () {
        return this.$.DOM.query(this.opt.renderTarget);
    }

    get isGameOver () {
    	return store.getState().game.winner;
    }
}

export default Sandbox;