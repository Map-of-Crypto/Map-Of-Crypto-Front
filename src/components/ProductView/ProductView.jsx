import styled from 'styled-components';
import { Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import useProductContext from "../../hooks/productContext";
import { useParams } from 'react-router-dom';
import ActivityIndicator from "../ActivityIndicator";

const Box = styled.div`
    width: 100%;
    min-height: 100px;
    background-color: #fff;
    padding: 16px;
`

const ProductView = () => {
    const [ selectedProduct, setSelectedProduct ] = useState(null);
    const { products, getSingleProduct } = useProductContext();
    const params = useParams();
    useEffect(() => {
        let product = products.find(p => p.id == params.productId);

        if(!product) {
            product = getSingleProduct(params.productId);
        }
        setSelectedProduct(product);
        console.log({ products, params, product })
    }, [setSelectedProduct, products, params]
    )
    if (!selectedProduct) {
        return <ActivityIndicator />;
      }

    return <Row justify="left" gutter={[{ xs: 8, md: 16 }, { xs: 8, md: 16 }]} align="top">
        <Col xs={24} md={12}>
            <Box>This is content</Box>
        </Col>
        <Col xs={24} md={12}>
            <Box>This is content</Box>
        </Col>
        <Col span={24}>
            <Box>{selectedProduct.description}</Box>
        </Col>
    </Row>
}

export default ProductView;