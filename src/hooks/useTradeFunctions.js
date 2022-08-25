
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";
import React, { useState, useCallback } from 'react'
import { message } from 'antd';
import { utils } from "ethers";
import { useContractContext } from './contract';

export const useTradeFunctions = () => {
    const [maticPrice, setMaticPrice] = useState(null);
    const { dappContract, aggregatorContract } = useContractContext();

    const getMaticPrice = useCallback(async () => {
        const { answer } = await aggregatorContract?.latestRoundData();
        setMaticPrice(answer.toNumber() / 10 ** 8);
    }, [aggregatorContract]);

    const initiateBuy = useCallback(async (product) => {
        const key = "initiateBuy";
        await message.loading({ content: "Waiting for acceptance...", key });

        try {
            const priceToSend = utils.parseUnits(
                // Reason why we divide it by 1000 is to save some MATIC since it's just PoC application
                `${(product.price * maticPrice) / 1000}`
            );
            const res = await dappContract?.makePurchaseRequest(product.id, {
                value: priceToSend,
            });
            await message.success({
                content: (
                    <span>
                        Success:{" "}
                        <a
                            target="_blank"
                            title="Transaction hash"
                            href={`https://mumbai.polygonscan.com//tx/${res.hash}`}
                            rel="noreferrer"
                        >
                            Check transaction on Polygonscan
                        </a>
                    </span>
                ),
                duration: 5,
                key,
            });
        } catch (err) {
            const parsedEthersError = getParsedEthersError(err);
            await message.error({ content: parsedEthersError.context, duration: 3, key });
        }
    }, [maticPrice, dappContract]);

    return { initiateBuy, getMaticPrice }
}