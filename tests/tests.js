import 'babel-polyfill';

describe('ES5 Tests', function () {
	it('Should Work', function () {
		expect(true).toBe(true);
	});
});

describe('ES6 Tests', () => {
	it('Should Work', () => {
		expect(true).toBe(true);
	});
});

// require('./services/WorkcloudService_test.js');
// require('./actions/sessionActions_test.js');
// require('./services/PlatformService_test.js');
// require('./reducers/sessionReducer_test.js');

var context = require.context('.', true, /\_test\.js/);
context.keys().forEach(context);