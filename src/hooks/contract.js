// hooks/index.ts
import { ethers } from "ethers";
import { useContractCall } from "@usedapp/core";
import MapOfCryptoAbi from "../contracts/abi/MapOfCrypto.json";
import { contractAddress } from "../contracts/abi/MapOfCrypto.json"

const mocContractInterface = new ethers.utils.Interface(MapOfCryptoAbi);

export function usePurchaseList() {
  const [purchaseList] = useContractCall({
    abi: mocContractInterface,
    address: contractAddress,
    method: "getPurchaseList",
    args: [],
  });
  return purchaseList;
}