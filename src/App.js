import WalletConnectProvider from "@walletconnect/ethereum-provider";
import React, { useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { providers } from "ethers";
import Web3Modal from "web3modal";
import { Mainnet, Kovan, Mumbai, DAppProvider } from "@usedapp/core";

import Main from "./components/Main/Main";
import Home from "./pages";

import "./App.css";

export const contractAddress = "0x6ed0039582D833756A87B347A978ECC6652ff028";

const chainConfig = {
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    // [Mainnet.chainId]: 'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    // [Kovan.chainId]: 'https://kovan.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    // [Mumbai.chainId]: RPC NEEDED HERE
  },
};

const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const ProviderContext = React.createContext({ provider: null, address: null });

export const useProviderContext = () => useContext(ProviderContext);

const App = () => {
  const [dappContract, setDappContract] = useState(null);
  const [chainId, setChainId] = useState(1);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState();

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    },
  });

  const reset = () => {
    setAddress(null);
    setProvider(null);
    web3Modal.clearCachedProvider();
  };

  const connect = async () => {
    const web3Provider = await web3Modal.connect();

    web3Provider.on("disconnect", reset);

    const accounts = await web3Provider.enable();
    setAddress(accounts[0]);
    setChainId(web3Provider.chainId);

    const provider = new providers.Web3Provider(web3Provider);
    setProvider(provider);
  };

  return (
    <DAppProvider config={chainConfig}>
      <ProviderContext.Provider value={{ address, provider }}>
        <Router>
          <Routes>
            <Route
              index
              exact
              element={
                <Home
                  dappContract={dappContract}
                  connect={connect}
                  address={address}
                />
              }
            />
            <Route exact path="/*" element={<Main />} />
          </Routes>
        </Router>
      </ProviderContext.Provider>
    </DAppProvider>
  );
};

export default App;
