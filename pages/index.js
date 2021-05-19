import React from 'react';
import styled from 'styled-components';
import HomePage from '../components/pages/home_page';
import Navigation from '../components/layout/navigation';

const ContainerSC = styled('div')`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
`;

export default () => (
  <ContainerSC>
    <HomePage />
    <Navigation />
  </ContainerSC>
);
