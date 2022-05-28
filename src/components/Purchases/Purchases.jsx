import { red, green } from '@ant-design/colors';
import { CheckSquareFilled, CloseSquareFilled } from "@ant-design/icons";
import { Row, Col, Card, Button, Form, Input, message } from 'antd';
import React, { useCallback, useEffect, useState, useMemo } from 'react'
import { constants, utils } from "ethers";
import humanizeDuration from "humanize-duration";
import { useContractContext } from "../../hooks/contract";
import styles from "./Purchases.module.css";

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
  },
  onStateUpdate,
}) {
  const { address, dappContract } = useContractContext();
  const cardStyle = {
    minWidth: "370px",
  };

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

  const acceptPurchase = useCallback(async () => {
    const key = "acceptPurchase";
    await message.loading({ content: "Waiting for acceptance...", key });
    try {
      await dappContract?.acceptPurchaseRequest(purchaseId);
      await message.success({
        content: (
          <span>{`Success! Purchase with id: ${purchaseId} is accepted`}</span>
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

    if (merchantAddress.toLowerCase() === address.toLowerCase() && accepted) {
      actions.push(
        <Form size="small" onFinish={onTrackinNumberSend}>
          <Form.Item name="trackingNumber">
            <span>
              <Input
                placeholder="tracking number"
                style={{
                  width: 160,
                  marginRight: 12,
                }}
              ></Input>
              <Button type="primary" htmlType="submit">
                Add Tracking Number
              </Button>
            </span>
          </Form.Item>
        </Form>
      );
    }
    return actions;
  }, [address, merchantAddress]);

  return (
    <Card style={cardStyle} hoverable actions={getActions}>
      <div className={styles.spaceBetween}>
        <div>
          <span className={styles.label_inline}>Purchase ID:</span>
          {purchaseId.toString()}
        </div>
        <div>
          <span className={styles.label_inline}>Accepted:</span>
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
        <span className={styles.label}>Buyer Address:</span>
        {buyerAddress}
      </div>
      <div>
        <span className={styles.label}>Merchant Address:</span>
        {merchantAddress}
      </div>
      <div>
        <span className={styles.label}>Price (in crypto):</span>
        {utils.formatEther(ethPrice.toNumber())}
      </div>
      <div>
        <span className={styles.label}>Funded (in crypto):</span>
        {utils.formatEther(ethFunded.toNumber())}
      </div>
      <div>
        <span className={styles.label}>TrackingNumber:</span>
        {trackingNumber.toString()}
      </div>
      <div>
        <span className={styles.label}>Deadline:</span>
        {humanizeDuration(deadline.toNumber())}
      </div>
    </Card>
  );
}

function Purchases() {
  const [purchases, setPurchases] = useState([])

  const { dappContract } = useContractContext();
  const getPurchases = useCallback(async () => {
    const res = await dappContract?.getPurchaseList()
    const results = res.filter(({ merchantAddress }) => merchantAddress !== constants.AddressZero).map(p => {
      const [purchaseId, merchantAddress, buyerAddress, accepted, deadline, ethPrice, ethFunded, trackingNumber] = p;
      return { purchaseId, merchantAddress, buyerAddress, accepted, deadline, ethPrice, ethFunded, trackingNumber }
    })
    setPurchases(results);
  }, [dappContract]);

  useEffect(() => {
    getPurchases()
  }, [dappContract])

  const generateCards = useCallback(() => {
    return purchases.map(purchase => <Col key={`purchaseNo-${purchase.purchaseId}`} span={{ xs: 24 }}>
        <PurchaseCard purchase={purchase} onStateUpdate={getPurchases}/>
      </Col>)
  }, [purchases, getPurchases])
  
  return (
    <div style={{ padding: "24px, 24px" }}>
      <Row gutter={{ xs: 8, sm: 16 }}>
      {generateCards()}
      </Row>
    </div>
  )
}

export default Purchases