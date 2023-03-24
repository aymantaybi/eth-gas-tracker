import TxpoolExplorer, { Transaction } from "txpool-explorer";
import { WebsocketProviderOptions } from "web3-core-helpers";
import { WebsocketProvider } from "web3-providers-ws";

import { websocketProviderOptions } from "./constants";

interface Constructor {
  host?: string;
  options?: WebsocketProviderOptions;
  websocketProvider?: WebsocketProvider;
}

class GasTracker {
  default: { gasPrice: number } = {
    gasPrice: 1000000000,
  };
  gasPrice: { max: number; min: number } = {
    max: this.default.gasPrice,
    min: this.default.gasPrice,
  };

  txpoolExplorer: TxpoolExplorer;

  constructor({ host, options = websocketProviderOptions, websocketProvider }: Constructor) {
    if (!host && !websocketProvider) throw new Error("You need to provide either 'host' or 'websocketProvider' to the constructor ");
    this.txpoolExplorer = new TxpoolExplorer(host ? { host, options } : { websocketProvider });
  }

  public defaults() {
    return this.default;
  }

  public setDefaults({ gasPrice }: { gasPrice: number }) {
    this.default = { gasPrice };
    this.gasPrice = { max: gasPrice, min: gasPrice };
  }

  watch(
    {
      filter = () => true,
    }: {
      filter?: (transaction: Transaction) => boolean;
    },
    callback: (gasPrice: { max: number; min: number }) => void = () => {}
  ) {
    this.txpoolExplorer.watch({ pool: "pending", filter }, (transactions) => {
      let gasPrices = transactions.map((transaction) => Number(transaction.gasPrice));
      let maxGasPrice = Math.max(...gasPrices);
      let minGasPrice = Math.min(...gasPrices);
      let { gasPrice } = this.default;
      let max = isFinite(maxGasPrice) ? maxGasPrice : gasPrice;
      let min = isFinite(minGasPrice) ? minGasPrice : gasPrice;
      this.gasPrice = { max, min };
      callback(this.gasPrice);
    });
  }
}

export default GasTracker;

export { Transaction };
