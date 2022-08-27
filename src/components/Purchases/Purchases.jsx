import { red, green } from '@ant-design/colors';
import { CheckSquareFilled, CloseSquareFilled } from "@ant-design/icons";
import { Row, Col, Card, Button, Form, Input, message, Typography } from 'antd';
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { constants, utils } from "ethers";
import humanizeDuration from "humanize-duration";
import { useContractContext } from "../../hooks/contract";
import ActivityIndicator from "../ActivityIndicator";
import styles from "./Purchases.module.css";
import { getParsedEthersError } from "@enzoferey/ethers-error-parser";
import useProductContext from "../../hooks/productContext";

const { Text } = Typography;

function PurchaseCard({
  purchase: {
    purchaseId,
    merchantAddress,
    buyerAddress,
    accepted,
    deadline,
    ethPrice,
    ethFunded,
    trackingNumber,
    productId
  },
  onStateUpdate,
  products
}) {
  const { address, dappContract } = useContractContext();
  const onTrackinNumberSend = useCallback(async ({ trackingNumber }) => {
    const key = "sendTrackingNumber";
    await message.loading({ content: "Sending tracking number...", key });
    try {
      if (trackingNumber) {
        await dappContract?.fulfillPurchaseRequest(purchaseId, trackingNumber);
        await message.success({
          content: `Tracking number: ${trackingNumber} added`,
          duration: 5,
          key,
        });
        onStateUpdate();
      }
    } catch (err) {
      console.error(err);
      await message.error({ content: err.message, duration: 3, key });
    }
  });

  const getProductName = useMemo(() => products.find((prod) => prod.id === productId.toString())?.title || '', [products]);

  const acceptPurchase = useCallback(async () => {
    const key = "acceptPurchase";
    await message.loading({ content: "Waiting for acceptance...", key });
    try {
      await dappContract?.acceptPurchaseRequest(purchaseId);
      await message.success({
        content: (
          <Text>{`Success! Purchase with id: ${purchaseId} is accepted`}</Text>
        ),
        duration: 5,
        key,
      });
      onStateUpdate();
    } catch (err) {
      console.error(err);
      await message.error({ content: err.message, duration: 3, key });
    }
  }, [dappContract]);

  const getActions = useMemo(() => {
    const actions = [];

    if (
      merchantAddress.toLowerCase() === address.toLowerCase() &&
      !accepted &&
      !ethFunded.isZero()
    ) {
      actions.push(
        <Button type="primary" onClick={acceptPurchase}>
          Accept Purchase
        </Button>
      );
    }

    if (merchantAddress.toLowerCase() === address.toLowerCase() && accepted && !trackingNumber) {
      actions.push(<Form size="small" onFinish={onTrackinNumberSend}>
        <Form.Item name="trackingNumber">
          <span>
            <Input
              placeholder="tracking number"
              style={{
                width: 160,
                marginRight: 12
              }}></Input>
            <Button type="primary" htmlType="submit">
              Add Tracking Number
            </Button>
          </span>
        </Form.Item>
      </Form>)
    }
    return actions;
  }, [address, merchantAddress]);

  return (
    <Card style={{ width: '100%' }}
      hoverable
      actions={getActions}
      title={getProductName}
    >
      <div className={styles.spaceBetween}>
        <div>
          <Text className={styles.label_inline}>Purchase ID:</Text>
          {purchaseId.toString()}
        </div>
        <div>
          <Text striong className={styles.label_inline}>Accepted:</Text>
          {accepted ? (
            <CheckSquareFilled
              style={{ fontSize: "18px", color: green.primary }}
            />
          ) : (
            <CloseSquareFilled
              style={{ fontSize: "18px", color: red.primary }}
            />
          )}
        </div>
      </div>
      <div>
        <Text string className={styles.label}>Buyer Address:</Text>
        {buyerAddress}
      </div>
      <div>
        <Text string className={styles.label}>Merchant Address:</Text>
        {merchantAddress}
      </div>
      <div>
        <Text string className={styles.label}>Price (in crypto):</Text>
        {utils.formatEther(ethPrice.toString())}
        {`${utils.formatEther(ethPrice.toString())} MATIC`}
      </div>
      <div>
        <Text string className={styles.label}>Funded (in crypto):</Text>
        {`${utils.formatEther(ethFunded.toString())} MATIC`}
      </div>
      <div>
        <Text string className={styles.label}>TrackingNumber:</Text>
        {trackingNumber.toString()}
      </div>
      <div>
        <Text string className={styles.label}>Deadline:</Text>
        {humanizeDuration(deadline.toString())}
      </div>
    </Card>
  );
}

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [withdrawBalance, setWithdrawBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(false)

  const { address, dappContract } = useContractContext();
  const { isLoading: isProductsLoading, getProducts, products } = useProductContext();

  const getPurchases = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await dappContract?.getPurchaseList();
      const results = res.filter(({ merchantAddress }) => merchantAddress !== constants.AddressZero).map(p => {
        const [purchaseId, merchantAddress, buyerAddress, accepted, deadline, ethPrice, ethFunded, trackingNumber, productId] = p
        return { purchaseId, merchantAddress, buyerAddress, accepted, deadline, ethPrice, ethFunded, trackingNumber, productId }
      });
      setPurchases(results);
      setIsLoading(false);

    } catch (error) {
      const parsedEthersError = getParsedEthersError(error);
      console.log(error)
      console.log(parsedEthersError)
    }
  }, [dappContract]);

  const withdrawBalanceFromContract = useCallback(async () => {
    const key = "withdraw";
    await message.loading({ content: "Withdraw in progress...", key });
    try {
      await dappContract?.withdraw(address);
      await message.success({
        content: <span>{`Success! Soon tokens will be on your wallet`}</span>,
        duration: 5,
        key,
      });
      setWithdrawBalance(0);
    } catch (err) {
      console.error(err);
      await message.error({ content: err.message, duration: 3, key });
    }
  }, [address, dappContract]);

  useEffect(() => {
    getPurchases();
    getWithdrawBalance();
    getProducts();
  }, [address, dappContract]);

  const generateCards = useCallback(() => {
    return purchases.map((purchase) => (
      <Col key={`purchaseNo-${purchase.purchaseId}`} xs={24} md={12}>
        <PurchaseCard purchase={purchase} onStateUpdate={getPurchases} products={products} />
      </Col>
    ));
  }, [purchases, getPurchases]);

  const getWithdrawBalance = useCallback(async () => {
    const balance = await dappContract?.balances(address);
    setWithdrawBalance(utils.formatEther(balance.toString()));
  }, [dappContract]);

  if (isLoading || isProductsLoading) {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Row style={{ marginBottom: 16 }}>
        <Col xs={24}>
          <Card>
            <div className={styles.flex_row}>
              <Text style={{fontSize: 24}}>
                <Text strong style={{marginRight: 16}}>Available to witdraw: </Text>
                {`${withdrawBalance} MATIC`}
              </Text>
              {withdrawBalance > 0 && (
                <Button
                  style={{ marginLeft: "16px" }}
                  size="large"
                  type="primary"
                  onClick={withdrawBalanceFromContract}
                >
                  Withdraw
                </Button>
              )}
            </div>
          </Card>
        </Col>
      </Row>
      <Row gutter={{ xs: 8, sm: 16 }}>{generateCards()}</Row>
    </>
  );
}

export default Purchases