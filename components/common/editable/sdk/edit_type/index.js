import styled from 'styled-components';

export const H1SC = styled('h1')`
  outline: none;
  //margin-left: -10px;
`;
export const H2SC = styled('h2')`
  outline: none;
  //margin-left: -9px;
`;
export const H3SC = styled('h3')`
  outline: none;
  //margin-left: -5px;
`;
export const H4SC = styled('h4')`
  outline: none;
  //margin-left: -5px;
`;
export const H5SC = styled('h5')`
  outline: none;
  //margin-left: -4px;
`;
export const H6SC = styled('h6')`
  outline: none;
  margin-left: -4px;
`;
export const PSC = styled('p')`
  outline: none;
`;

export const InlinePlainSC = styled('span')`
  display: inline-block;
`;

export const PlainSC = styled('span')`
  
`;

export const MdSymbolSC = styled('i', ['active'])`
  opacity: .5;
  width: 0;
  height: 0;
  display: inline-block;
  overflow: hidden;
`;

export const MdFrontSymbolSC = styled(MdSymbolSC)`
  
`;

export const MarkSC = styled('mark')`
  background: #ff0;
  color: #000;
`;

export const DelSC = styled('del')`

`;

export const CodeSC = styled('code')`
  background-color: #f3f4f4;
  padding: 0 2px;
  border-radius: 3px;
  color: #333333;
`;

export const EmSC = styled('em')`
  
`;

export const BoldSC = styled('span')`
  font-weight: bold;
`;

export const EmBoldSC = styled('em')`
  font-weight: bold;
`;
