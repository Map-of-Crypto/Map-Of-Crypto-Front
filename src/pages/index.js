import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import InfoSection from "../components/InfoSection";
import {
  sectionOne,
  sectionTwo,
  sectionThree,
  sectionFour,
  sectionFive,
} from "../components/InfoSection/Data";
import Services from "../components/Services";
import StepExampleGroup from "../components/Steps";
import { useContractContext } from "../hooks/contract";

const Home = ({ connect }) => {
  const { address } = useContractContext(); 
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if(address) {
      navigate("/map");
    }
  }, [navigate, address]);

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
      <StepExampleGroup {...sectionFive} connect={connect} address={address} />
      <Footer />
    </>
  );
};

export default Home;
