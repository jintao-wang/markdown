import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import useTextHandler from './useTextHandler';
import { objectCache } from './utils/common';

const Editable = () => {
  const lineListRef = useRef([]);
  const inLineTextRef = useRef(new WeakMap());
  const objectCacheRef = useRef(objectCache());

  const {
    linesRenderData,
    handleKeyUp,
    handleKeyPress,
    handleKeyDown,
    rendering,
  } = useTextHandler(lineListRef.current, inLineTextRef.current);

  useEffect(() => {
    // console.log(linesRenderData);
  }, []);

  const LineRender = (content) => {
    if (typeof content === 'string') return null;
    return (
      content.map((item) => {
        if (typeof item.content === 'string') {
          return (
            <item.type
              ref={(e) => inLineTextRef.current.set(item, e)}
              key={objectCacheRef.current(item, true)}
              dangerouslySetInnerHTML={{ __html: item.content }}
              data-objectid={objectCacheRef.current(item, true)}
            />
          );
        }
        return (
          <item.type
            key={objectCacheRef.current(item, true)}
            data-objectid={objectCacheRef.current(item, true)}
          >
            {
              LineRender(item.content)
            }
          </item.type>
        );
      })
    );
  };

  const getLineHtml = (content) => {
    if (typeof content === 'string') {
      return {
        __html: content,
      };
    }
    return null;
  };

  return (
    <ContainerSC
      onKeyPress={handleKeyPress}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      contentEditable
      suppressContentEditableWarning
      rendering={rendering}
    >
      {
        linesRenderData.map((lineItem, index) => (
          <lineItem.type
            data-objectid={objectCacheRef.current(lineItem, true)}
            key={objectCacheRef.current(lineItem, true)}
            ref={(e) => lineListRef.current[index] = e}
            contentEditable
            suppressContentEditableWarning
            dangerouslySetInnerHTML={getLineHtml(lineItem.content)}
          >
            {
              LineRender(lineItem.content, index)
            }
          </lineItem.type>
        ))
      }
    </ContainerSC>
  );
};

export default Editable;

const ContainerSC = styled('div', 'rendering')`
  width: 100%;
  height: 100%;
  outline: none;
  overflow: auto;
  color: rgb(186, 186, 186);
  transition: caret-color 0.1s;
  
  [contenteditable] {
    caret-color: ${(props) => (props.rendering ? 'rgb(0, 189, 184, 0)' : 'rgb(0, 189, 184, 1)')} !important;
  }
`;
