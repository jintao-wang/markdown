import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import TextHandler from '../sdk/TextHandler';
import GetMarkdownText from '../sdk/markdown_data';

const ContainerSC = styled('div')`
  width: 100%;
  height: 100%;
  outline: none;
  overflow: auto;
  color: rgb(186, 186, 186);
`;

const Editable = () => {
  const textHandlerRef = useRef(null);
  const textHandler = textHandlerRef.current;

  const forceUpdateRef = useRef(false);
  const [forceUpdate, setForceUpdate] = useState(forceUpdateRef.current);

  useEffect(() => {
    const initial = async () => {
      const markdownText = await GetMarkdownText('https://oss-wjt.oss-cn-shanghai.aliyuncs.com/markdown/2021-3-11.md');
      console.log(markdownText)
      textHandlerRef.current = new TextHandler(handleForceUpdate, markdownText);
      handleForceUpdate();
    };
    initial();
  }, []);

  const handleForceUpdate = () => {
    forceUpdateRef.current = !forceUpdateRef.current;
    setTimeout(() => setForceUpdate(forceUpdateRef.current));
  };

  const LineRender = (content) => {
    if (typeof content === 'string') return null;
    return (
      content.map((item) => {
        if (typeof item.content === 'string') {
          return (
            <item.type
              key={item.id}
              dangerouslySetInnerHTML={{ __html: item.content }}
              id={item.id}
            />
          );
        }
        return (
          <item.type
            key={item.id}
            id={item.id}
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
      onKeyPress={(e) => textHandlerRef.current.onKeyPress(e)}
      onKeyDown={(e) => textHandlerRef.current.onKeyDown(e)}
      onKeyUp={(e) => textHandlerRef.current.onKeyUp(e)}
      contentEditable
      suppressContentEditableWarning
    >
      {
        textHandlerRef.current?.linesData.map((lineItem, index) => (
          <lineItem.type
            forceUpdate={forceUpdate}
            id={lineItem.id}
            key={lineItem.id}
            ref={(e) => textHandlerRef.current.setLineListRef(e, index)}
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
