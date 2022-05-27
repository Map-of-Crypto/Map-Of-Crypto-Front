import { Button, Card, Col, message, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';
import { useContractContext } from '../../hooks/contract';

const ProductCard = ({ product, merchant }) => {
  const { dappContract } = useContractContext()

  const initiateBuy = async () => {
    const key = 'updatable';
    await message.loading({ content: 'Waiting for acceptance...', key });
    try {
      const res = await dappContract?.makePurchaseRequest(merchant.id, product.id);
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
              Check transaction on etherscan
            </a>
          </span>
        ),
        duration: 5,
        key,
      });
    } catch (err) {
      console.error(err);
      await message.error({ content: err.message, duration: 3, key });
    }
  };

  return (
    <Card
      cover={<img alt="example" src="https://picsum.photos/300/300" />}
      hoverable
      title={product.name}
      actions={[<div>{`Price: ${product.price}${product.currency}`}</div>, <Button onClick={initiateBuy}>Buy</Button>]}>
      <div>{product.description}</div>
    </Card>
  );
};

const Products = () => {
  const [availableProducts, setAvailableProducts] = useState([]);
  const [availableMerchants, setAvailableMerchants] = useState([]);

  const getProducts = useCallback(async () => {
    try {
      const p = await fetch('https://mapofcrypto-cdppi36oeq-uc.a.run.app/products')
      const { products } = await p.json();
      setAvailableProducts(products)
    } catch (e) {
      console.error(e)
    }
  }, [])

  const getMerchants = useCallback(async () => {
    try {
      const m = await fetch('https://mapofcrypto-cdppi36oeq-uc.a.run.app/merchants')
      const { merchants } = await m.json();

      setAvailableMerchants(merchants)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    getProducts()
    getMerchants()
  }, [getProducts, getMerchants])

  const renderProducts = useCallback(() => {
    const getMerchant = (merchantId) => availableMerchants.find((m) => m.id === merchantId);
    return availableProducts.map((product) => (
      <Col key={`${product.id}`} span={6}>
        <ProductCard product={product} merchant={getMerchant(product.merchant)} />
      </Col>
    ));
  }, [availableProducts, availableMerchants]);

  return <Row gutter={[16, 16]}>{renderProducts()}</Row>
};

export default Products;
