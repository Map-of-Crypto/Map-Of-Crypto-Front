import React from 'react';
import { GiMagnifyingGlass, GiReceiveMoney } from "react-icons/gi";
import { FaHandshake } from "react-icons/fa";

import {
  ServicesContainer,
  ServicesH1,
  ServicesWrapper,
  ServicesCard,
  ServicesH2,
  ServicesP,
} from "./ServicesElements";

const Services = () => {
  return (
    <ServicesContainer id="services">
      <ServicesH1>How it Works</ServicesH1>
      <ServicesWrapper>
        <ServicesCard>
          <div style={{ fontSize: "80px", padding: "10px" }}>
            <GiMagnifyingGlass />
          </div>
          <ServicesH2>List or Find</ServicesH2>
          <ServicesP>
            Look for the item you want to buy, or list the item you want to
            sell.
          </ServicesP>
        </ServicesCard>
        <ServicesCard>
          <div style={{ fontSize: "80px", padding: "10px" }}>
            <FaHandshake />
          </div>
          <ServicesH2>Agreement</ServicesH2>
          <ServicesP>
            Agree on a price for the given item, and deposit the price in our
            contract so that the money stays between the buyer and seller.
          </ServicesP>
        </ServicesCard>
        <ServicesCard>
          <div style={{ fontSize: "80px", padding: "10px" }}>
            <GiReceiveMoney />
          </div>
          <ServicesH2>Receive</ServicesH2>
          <ServicesP>
            Once the buyer gets the cargo with the item, our contract is
            notified via Oracles and seller can withdraw the money.
          </ServicesP>
        </ServicesCard>
      </ServicesWrapper>
    </ServicesContainer>
  );
};

export default Services;
