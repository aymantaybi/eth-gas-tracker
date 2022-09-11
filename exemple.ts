import * as dotenv from "dotenv";
import Web3 from "web3";
import { Transaction } from "txpool-explorer";
import { websocketProviderOptions } from "txpool-explorer/dist/constants";
import GasTracker from "./src";

dotenv.config();

const { WEBSOCKET_PROVIDER, PRIVATE_KEY } = process.env;

const websocketProvider = new Web3.providers.WebsocketProvider(
  WEBSOCKET_PROVIDER!,
  websocketProviderOptions
);

const web3 = new Web3(websocketProvider);

web3.eth.accounts.wallet.add(PRIVATE_KEY!);

const gasTracker = new GasTracker({ websocketProvider });

const { txpoolExplorer } = gasTracker;

let routerAddess = "0x7D0556D55ca1a92708681e2e231733EBd922597D";
let accountAddress = "0x348444251E666CAcBba54268245e5DfaBB4C66ee";

let filter = (transaction: Transaction) =>
  transaction.to == routerAddess && transaction.from != accountAddress;

gasTracker.watch({ filter }, (gasPrice) => {
  console.log(gasPrice);
  let accountPendingTransactions = txpoolExplorer.getPoolTransactions(
    "pending",
    (transaction: Transaction) =>
      transaction.to == routerAddess && transaction.from == accountAddress
  );

  for (let accountPendingTransaction of accountPendingTransactions) {
    if (Number(accountPendingTransaction.gasPrice) <= gasPrice.max) {
      replaceTransaction(accountPendingTransaction, gasPrice.max, 1.2);
    }
  }
});

txpoolExplorer.watch(
  {
    pool: "pending",
    filter: (transaction: Transaction) => transaction.from == accountAddress,
  },
  (transactions: Transaction[]) => {
    for (let transaction of transactions) {
      let { gasPrice } = gasTracker;
      if (Number(transaction.gasPrice) <= gasPrice.max) {
        replaceTransaction(transaction, gasPrice.max, 1.2);
      }
    }
  }
);

function replaceTransaction(
  transaction: Transaction,
  maxGasPrice: number,
  multiplier: number
) {
  try {
    transaction.gasPrice = (maxGasPrice * multiplier).toFixed(0);

    console.log(
      `Replacing transaction ${transaction.hash} with gas price : ${transaction.gasPrice}`
    );

    let promisEvent = web3.eth.sendTransaction({
      from: transaction.from,
      to: transaction.to,
      data: transaction.input,
      nonce: transaction.nonce,
      value: transaction.value,
      gasPrice: transaction.gasPrice,
      gas: transaction.gas,
    });
    promisEvent.catch((error) => {
      console.log(error.message);
    });
  } catch (error: any) {
    console.log(error.message);
  }
}
