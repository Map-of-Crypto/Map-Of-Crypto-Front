import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { Mainnet, Mumbai, DAppProvider } from "@usedapp/core";

import { utils, Contract, providers } from "ethers";
import MapOfCryptoAbi from "./contracts/abi/MapOfCrypto.json";
import AggregatorV3Interface from "./contracts/abi/AggregatorV3Interface.json";
import { ContractContext } from "./hooks/contract";
import { contractAddress, aggregatorContractAddress } from './constants'
import Main from "./components/Main/Main";
import Home from "./pages";

import "./App.css";

const mocContractInterface = new utils.Interface(MapOfCryptoAbi);
const aggregatorV3Interface = new utils.Interface(AggregatorV3Interface);

const chainConfig = {
  networks: [Mumbai],
  readOnlyChainId: Mainnet.chainId,
  readOnlyUrls: {
    // [Mainnet.chainId]: 'https://mainnet.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    // [Kovan.chainId]: 'https://kovan.infura.io/v3/62687d1a985d4508b2b7a24827551934',
    [Mumbai.chainId]: 'https://polygon-mumbai.g.alchemy.com/v2/UcJQZqq6LT_gfzyMrFZh0PD0GWni4R6a'
  },
};

const providerOptions = {
  injected: {
    display: {
      name: 'Metamask',
      description: 'Connect with the provider in your Browser',
    },
    package: null,
  },
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      bridge: 'https://bridge.walletconnect.org',
      infuraId: process.env.REACT_APP_INFURA_ID,
    },
  },
}

// const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const App = () => {
  const [dappContract, setDappContract] = useState(null);
  const [aggregatorContract, setAggregatorContract] = useState(null);
  const [, setChainId] = useState(1);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState();
  // const { activate } = useEthers();

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions
  });

  const reset = () => {
    setAddress("");
    setProvider(undefined);
    web3Modal.clearCachedProvider();
  };

  const connect = async () => {
    const web3Provider = await web3Modal.connect();

    web3Provider.on("disconnect", reset);

    const accounts = await web3Provider.enable();
    setAddress(accounts[0]);
    setChainId(web3Provider.chainId);

    const provider = new providers.Web3Provider(web3Provider);

    const contract = new Contract(contractAddress, mocContractInterface, provider.getSigner());
    const aggregateContract = new Contract(aggregatorContractAddress, aggregatorV3Interface, provider.getSigner());
    setProvider(provider);
    setDappContract(contract);
    setAggregatorContract(aggregateContract);
  };

  return (
    <DAppProvider config={chainConfig}>
      <ContractContext.Provider value={{ provider, address, dappContract, aggregatorContract }}>
        <Router>
          <Routes>
            <Route
              exact
              index
              element={
                <Home
                  dappContract={dappContract}
                  connect={connect}
                />
              }
            />
            <Route exact path="/*" element={<Main />} />
          </Routes>
        </Router>
      </ContractContext.Provider>
    </DAppProvider>
  );
};

export default App;
