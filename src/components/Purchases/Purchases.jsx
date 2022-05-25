import { CheckSquareFilled, CloseSquareFilled } from "@ant-design/icons";
import { Table } from 'antd';
import React, { useEffect, useMemo } from 'react'
import mockedPurchase from './mockedPurchaseStruct.json';
import { red, green } from '@ant-design/colors';

const columns = [
  {
    title: "accepted",
    dataIndex: "accepted",
    key: "accepted",
    render: (_, { accepted }) => ( 
      <> 
        {accepted ? <CheckSquareFilled style={{fontSize: '16px', color: green.primary}} /> : <CloseSquareFilled style={{fontSize: '16px', color: red.primary}}/>}
      </>
    )
  },
  {
    title: "buyerAddress",
    dataIndex: "buyerAddress",
    key: "buyerAddress"
  },
  {
    title: "deadline",
    dataIndex: "deadline",
    key: "deadline"
  },
  {
    title: "ethFunded",
    dataIndex: "ethFunded",
    key: "ethFunded"
  },
  {
    title: "ethPrice",
    dataIndex: "ethPrice",
    key: "ethPrice"
  },
  {
    title: "merchantAddress",
    dataIndex: "merchantAddress",
    key: "merchantAddress"
  },
  {
    title: "purchaseId",
    dataIndex: "purchaseId",
    key: "purchaseId"
  },
  {
    title: "trackingNumber",
    dataIndex: "trackingNumber",
    key: "trackingNumber"
  },
]

function Purchases() {
  useEffect(() => {
    console.log({red, green})
    console.log(mockedPurchase)
  }, [])
  const purchases = useMemo(() => { return mockedPurchase.map(p => {
   const [ purchaseId, merchantAddress, buyerAddress, accepted, deadline, ethPrice, ethFunded, trackingNumber ] = p;
   return { purchaseId, merchantAddress, buyerAddress, accepted, deadline, ethPrice, ethFunded, trackingNumber }
  })}, [])

  useEffect(() => {
    console.log(purchases)
  }, [purchases])
  return (
    <div style={{padding: "24px, 24px"}}>
      Wafelki
      <Table dataSource={purchases} columns={columns} />

    </div>
  )
}

export default Purchases