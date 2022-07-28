import Web3 from "web3";

interface IGasTracker {
    websocketProvider: string
}

class GasTracker {

    web3: Web3;
    default: {
        gasPrice: number,
        gasLimit: number,
    };

    constructor({ websocketProvider }: IGasTracker) {
        this.web3 = new Web3(new Web3.providers.WebsocketProvider(websocketProvider));
        this.default = {
            gasPrice: 100,
            gasLimit: 100,
        }
    }

    public defaults() {
        return this.default;
    }


}

export default GasTracker;