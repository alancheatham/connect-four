// for es6
// import 'babel-polyfill';

import Sandbox from './Sandbox';

/* facade: DOM */
const DOMFacade = {
    query: selector => document.querySelector(selector)
};

class Framework {
    constructor (opt) {
        this._ = new Sandbox(this, opt);
    }

    get DOM () {
        return DOMFacade;
    }
}

export default Framework;