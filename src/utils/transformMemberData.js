import { ethers } from "ethers";

export const transformMemberData = (memberData) => {
  return {
    helperTokens: memberData.helperTokens.toNumber(),
    foundHelp: memberData.foundHelp.toNumber(),
    // totalSupported: ethers.utils.formatEther(memberData.totalSupported),
  };
};
