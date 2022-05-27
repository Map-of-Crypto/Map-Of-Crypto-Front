// hooks/index.ts
import { utils, Contract } from "ethers";
import { useContractFunction } from "@usedapp/core";
import MapOfCryptoAbi from "../contracts/abi/MapOfCrypto.json";
import { contractAddress } from "../constants";
import { useProviderContext } from '../App';

const mocContractInterface = new utils.Interface(MapOfCryptoAbi);

export function usePurchaseList() {
  const { provider } = useProviderContext();
  console.log(provider.getSigner())
  const signer = provider.getSigner()
  const contract = new Contract(contractAddress, mocContractInterface, signer)
  const { send, state } = useContractFunction({
    contract: contract,
    method: "getPurchaseList",
    // args: [],
  });

  return { send, state };
}