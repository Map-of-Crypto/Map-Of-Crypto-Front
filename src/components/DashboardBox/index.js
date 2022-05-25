import React from 'react';
import { Form, FormH1, FormH2 } from './DashboardBoxElement';

const DashboardBox = ({ amount = 0, label, unit, icon }) => {
  return (
    <div style={{ margin: '20px' }}>
      <FormH2>{label}: </FormH2>
      <Form>
        <div style={{ fontSize: '6em', marginRight: '50px' }}>{icon}</div>
        <FormH1>{amount}</FormH1>
        <FormH2> {unit}</FormH2>
      </Form>
    </div>
  );
};

export default DashboardBox;
