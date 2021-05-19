import styled from 'styled-components';

export const H1SC = styled('h1')`
  outline: none;
  //text-indent:-0.33em;
`;
export const H2SC = styled('h2')`
  outline: none;
  //text-indent:-0.33em;
`;
export const H3SC = styled('h3')`
  outline: none;
  //text-indent:-0.33em;
`;
export const H4SC = styled('h4')`
  outline: none;
  //text-indent:-0.33em;
`;
export const H5SC = styled('h5')`
  outline: none;
  //text-indent:-0.33em;
`;
export const H6SC = styled('h6')`
  outline: none;
  //text-indent:-0.33em;
`;
export const PSC = styled('p', 'rendering')`
  outline: none;
  position: relative;
  white-space: pre-wrap;
  orphans: 4;
  word-wrap: break-word;
  box-sizing: border-box;
  display: flex;
  caret-color: ${(props) => (props.rendering ? 'rgb(0, 189, 184, 0)' : 'rgb(0, 189, 184, 1)')} !important;
`;

export const InlinePlainSC = styled('span')`
  display: inline-block;
`;

export const PlainSC = styled('span')`
  min-width: 5px;
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
  display: flex;
  align-items: center;
`;

export const EmSC = styled('em')`
  
`;

export const BoldSC = styled('span')`
  font-weight: bold;
`;

export const EmBoldSC = styled('em')`
  font-weight: bold;
`;
