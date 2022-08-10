import GasTracker from '../src';

const { WEBSOCKET_PROVIDER } = process.env;

const gasTracker = new GasTracker({ websocketProvider: WEBSOCKET_PROVIDER! });

test('Gas tracker default gas', () => {

    gasTracker.setDefaults({ gasPrice: 100000 });

    var { gasPrice } = gasTracker.defaults();

    expect(gasPrice).toBe(100000);

});