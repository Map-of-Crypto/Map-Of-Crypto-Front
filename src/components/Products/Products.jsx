import { Button, Card, Col, message, Row } from 'antd';
import React, { useCallback, useEffect, useState } from 'react';

import merchantMock from './mockedMerchants.json';
import productMock from './mockedProducts.json';


const ProductCard = ({ product, merchant }) => {
  // const ethersContext = useEthersContext();
  // const mapOfCrypto = useAppContracts('MapOfCrypto', ethersContext.chainId);

  const initiateBuy = async () => {
    const key = 'updatable';
    await message.loading({ content: 'Waiting for acceptance...', key });
    try {
      // const res = await mapOfCrypto?.makePurchaseRequest(merchant.id, product.id);
      await message.success({
        content: (
          <span>
            Success:{' '}
            <a
              target="_blank"
              title="Transaction hash"
              href={`https://kovan.etherscan.io/tx/${'yada%20yada'}`}
              rel="noreferrer">
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
  })

  const getMerchants = useCallback(async () => {
    try {
      const p = await fetch('https://mapofcrypto-cdppi36oeq-uc.a.run.app/merchants')
      const { merchants } = await p.json();

      setAvailableMerchants(merchants)
    } catch (e) {
      console.error(e)
    }
  })

  useEffect(() => {
    getProducts()
    getMerchants()
  }, [])

  const renderProducts = useCallback(() => {
    const { merchants } = merchantMock;
    const getMerchant = (merchantId) => merchants.find((m) => m.id === merchantId);
    return availableProducts.map((product) => (
      <Col key={`${product.id}`} span={6}>
        <ProductCard product={product} merchant={getMerchant(product.merchant)} />
      </Col>
    ));
  }, [availableProducts]);

  return <Row gutter={[16, 16]}>{renderProducts()}</Row>
};

export default Products;
