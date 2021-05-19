import React from 'react';
import styled from 'styled-components';
import Editable from '../../components/common/editable/2.0';

const ContainerSC = styled('div')`
  width: 100%;
  min-height: 100vh;
  background: rgb(43, 43, 43);
  padding: 30px 30px 0 30px;
  box-sizing: border-box;
`;

export default () => (
  <ContainerSC>
    <Editable />
  </ContainerSC>
);
