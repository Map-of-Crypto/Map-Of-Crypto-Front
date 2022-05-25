import React from 'react';
import Icon1 from '../../images/giveHelp.svg';
import Icon2 from '../../images/findHelp.svg';
import Icon3 from '../../images/support.svg';
import {
  ServicesContainer,
  ServicesH1,
  ServicesWrapper,
  ServicesCard,
  ServicesIcon,
  ServicesH2,
  ServicesP,
} from './ServicesElements';

const Services = () => {
  return (
    <ServicesContainer id='services'>
      <ServicesH1>Become a</ServicesH1>
      <ServicesWrapper>
        <ServicesCard>
          <ServicesIcon src={Icon1} />
          <ServicesH2>Volunteer</ServicesH2>
          <ServicesP>
            Become a volunteer and help nearby Help-Seekers around you, gaining
            tokens and money.
          </ServicesP>
        </ServicesCard>
        <ServicesCard>
          <ServicesIcon src={Icon2} />
          <ServicesH2>Help-Seeker</ServicesH2>
          <ServicesP>
            Become a Help-Seeker and receive any kind of help from awaiting
            volunteers.
          </ServicesP>
        </ServicesCard>
        <ServicesCard>
          <ServicesIcon src={Icon3} />
          <ServicesH2>Supporter</ServicesH2>
          <ServicesP>
            Become a Supporter and help our cause by providing funding to
            volunteers and charities.
          </ServicesP>
        </ServicesCard>
      </ServicesWrapper>
    </ServicesContainer>
  );
};

export default Services;
