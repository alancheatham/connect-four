import GameService from '../../src/services/GameService';
import mockSandbox from '../constants/mockSandbox';

describe('GameService', () => {
	let sandbox;
	beforeEach(() => {
		sandbox = mockSandbox;
	});

	describe('constructor()', () => {
		it('Should scope sandbox', () => {
			const service = new GameService(sandbox);
			expect(service.$).toBe(sandbox);
		});

		it('Should call initListeners()', () => {
			spyOn(GameService.prototype, 'initListeners');
			const service = new GameService(sandbox);

			expect(GameService.prototype.initListeners).toHaveBeenCalled();
		})
	});

	describe('initListeners()', () => {
		it('Should subscribe to store', () => {
			spyOn(sandbox.store, 'subscribe');
			const service = new GameService(sandbox);

			service.initListeners();
			expect(sandbox.store.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
		});
	});

	describe('checkHorizontalPlanes', () => {
		it('Should return "white" if white won', () => {
			const board = [
				['W', 'B'],
				['W', 'B'],
				['W', 'B'],
				['W'],
				['B'],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
				[],
			];
			spyOn(sandbox.store, 'getState').and.returnValue({ game: { board }})

			const service = new GameService(sandbox);

			const winner = service.checkHorizontalPlanes();
			expect(winner).toEqual('W');
		});
	});
});