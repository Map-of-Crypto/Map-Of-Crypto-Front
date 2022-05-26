import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import InfoSection from '../components/InfoSection';
import {
  sectionOne,
  sectionTwo,
  sectionThree,
  sectionFour,
  sectionFive,
} from '../components/InfoSection/Data';
import Services from '../components/Services';
import StepExampleGroup from '../components/Steps';
import { useProviderContext } from '../App';

const Home = ({ dappContract, connect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { address } = useProviderContext();
  const navigate = useNavigate();

  useEffect(() => {
    if(address) {
      navigate('./products');
    }
  }, [address])

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const mintNFT = async () => {
    try {
      const mintTxn = await dappContract.mintMembershipNFT();
      await mintTxn.wait();
    } catch (error) {
      console.warn('Error: ', error);
    }
  };

  return (
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} connect={connect} address={address} />
      <HeroSection />
      <InfoSection {...sectionOne} />
      <InfoSection {...sectionTwo} />
      <InfoSection {...sectionThree} />
      <InfoSection {...sectionFour} />
      <Services />
      <StepExampleGroup
        {...sectionFive}
        connect={connect}
        address={address}
        mintNFT={mintNFT}
      />
      <Footer />
    </>
  );
};

export default Home;
