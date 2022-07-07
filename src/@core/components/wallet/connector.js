import { InjectedConnector } from "@web3-react/injected-connector";

const Web3 = require('web3');


export const injected = new InjectedConnector({
  supportedChainIds: [56, 97, 1337],
});

export const getWeb3 = (chainId) => {
  switch (chainId) {
    case 56:
      return new Web3(new Web3.providers.WebsocketProvider(process.env.REACT_APP_BSC_MAINNET_WS));
    case 97:

      return new Web3(new Web3.providers.WebsocketProvider(process.env.REACT_APP_BSC_TESTNET_WS));
      
      // return new Web3(new Web3.providers.WebsocketProvider("wss://testnet.binance.vision/ws"));
    case 1337:
      return new Web3(window.ethereum);
    default:
      return new Web3(window.ethereum);
  }
}