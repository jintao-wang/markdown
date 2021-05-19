import React, { useEffect } from 'react';
import styled from 'styled-components';

const ContainerSC = styled('div')`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: 65px;
  //background: rgb(38, 38, 38);
  background: rgb(59, 63, 65);
  z-index: 10;
`;

const IconSC = styled('div', ['active', 'borderColor'])`
  width: 100%;
  height: 65px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  //background: ${(props) => props.active && 'rgb(44, 46, 47)'};
  position: relative;
  &::after {
    content: "";
    width: 5px;
    height: 100%;
    background: ${(props) => props.active && props.borderColor};
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
  }
  
  
  .icon {
    width: 45%;
  }
  
  .describe {
    margin-top: 5px;
    font-size: 10px;
    color: rgb(234, 235, 235);
  }
`;

const Navigation = () => {
  useEffect(() => {}, []);

  return (
    <ContainerSC>
      <IconSC active borderColor="rgb(4, 106, 138)">
        <img className="icon" src={require('./static/add.svg')} alt="" />
        <div className="describe">添加</div>
      </IconSC>
      <IconSC borderColor="rgb(125, 135, 179)">
        <img className="icon" src={require('./static/collect.svg')} alt="" />
        <div className="describe">收集</div>
      </IconSC>
      <IconSC borderColor="rgb(62, 173, 254)">
        <img className="icon" src={require('./static/project.svg')} alt="" />
        <div className="describe">项目</div>
      </IconSC>
    </ContainerSC>
  );
};

export default Navigation;
