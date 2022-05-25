import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import {
  Mainnet,
  Kovan,
  Mumbai,
  DAppProvider,
} from '@usedapp/core'

import "./App.css";

import Main from './components/Main/Main';

export const contractAddress = "0x6ed0039582D833756A87B347A978ECC6652ff028"

const chainConfig = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    // [Mainnet.chainId]: 'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    // [Kovan.chainId]: 'https://kovan.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    // [Mumbai.chainId]: RPC NEEDED HERE
  }
}
const App = () => {

  return <DAppProvider config={chainConfig}>
    <Router>
      <Main />
    </Router>;
  </DAppProvider>
};

export default App;
