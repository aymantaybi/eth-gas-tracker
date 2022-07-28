
import utils from 'web3-utils';
import GasTracker from '../src';

jest.mock("web3-utils");

jest.mock('web3-providers-ws', () => jest.fn().mockImplementation(() => { return {} }));

const { WEBSOCKET_PROVIDER } = process.env;

const gasTracker = new GasTracker({ websocketProvider: WEBSOCKET_PROVIDER! });

test('Gas tracker default gas', () => {

    var defaults = gasTracker.defaults();

    expect(defaults.gasPrice).toBe(100);
    expect(defaults.gasLimit).toBe(100);

});

/* const mockedRandomHex = utils.randomHex as jest.MockedFunction<typeof utils.randomHex>;

mockedRandomHex.mockImplementation(() => "mocked return for this test"); */