import React from 'react';
import Lottie from 'react-lottie';

import { Container } from './ActivityElements';

const ActivityIndicator = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: require('../../lotties/heartLoader.json'),
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <Container>
      <Lottie options={defaultOptions} width={350} height={350} />
    </Container>
  );
};

export default ActivityIndicator;
