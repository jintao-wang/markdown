import { useEffect, useRef, useState } from 'react';
import { useImmer } from 'use-immer';
import getText from './get_text_data';
import { dataMockInitial } from './parsed_data_mock';
import parseLineText from './text_handler/parseLineText';
import * as EditType from './edit_type';


const useTextHandler = (lineListDom, inLineTextDom) => {
  const [linesRenderData, updateLinesRenderData] = useImmer([]);
  const linesDataRef = useRef(null);
  const activeLine = useRef(0);
  const needCheck = useRef(false);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    linesDataRef.current = linesRenderData;
  }, [linesRenderData]);

  useEffect(() => {
    const initial = async () => {
      // // 获取初始的text
      // const text = await getText('https://oss-wjt.oss-cn-shanghai.aliyuncs.com/markdown/2021-3-11.md');

      // // 解析初始 text -> linesRenderData(need edit)
      // console.log('解析初始text：');
      // console.log(text);

      // 更新linesRenderData并触发渲染
      updateLinesRenderData((draft) => {
        // 先使用mock的data(need edit)
        dataMockInitial.forEach((lineRenderData) => {
          draft.push(lineRenderData);
        });
      });
    };
    initial();
  }, []);

  const handleParse = (lineText) => {
    const lineRenderData = parseLineText(lineText);
    updateLinesRenderData((draft) => {
      draft[activeLine.current] = lineRenderData;
    });
  };

  const handleKeyDown = (e) => {
    // console.log(e, 1);
    const keyCode = e.keyCode || e.which || e.charCode;
    const { ctrlKey, metaKey, shiftKey } = e;

    const lineText = lineListDom[activeLine.current].innerText;
    if (e.key === 's' && ctrlKey) {
      console.time('解析一行时间');
      needCheck.current = true;
      console.timeEnd('解析一行时间');
    }

    // 检查###触发
    if (
      linesRenderData[activeLine.current].type === EditType.PSC
      && lineText[0] === '#'
      && e.key === ' '
    ) {
      needCheck.current = true;
      setRendering(true);
    }

    // 检查``, 高频率触发，需要矫正
    if (
      e.key === '`'
    ) {
      needCheck.current = true;
      setRendering(true);
    }

    // 检查*, 高频率触发，需要矫正
    if (
      e.key === '*'
    ) {
      needCheck.current = true;
      setRendering(true);
    }

    // 检查=, 高频率触发，需要矫正
    if (
      e.key === '='
    ) {
      needCheck.current = true;
      setRendering(true);
    }
  };

  const handleKeyPress = (e) => {
    // console.log(e, 2);
  };

  const handleKeyUp = (e) => {
    // console.log(e, 3);
    let lineText = lineListDom[activeLine.current].innerText;

    if (needCheck.current) {
      needCheck.current = false;
      lineText = lineText.replace(/[\r\n]/g, '');
      setCursor();
      handleParse(lineText);
    }
  };

  const setCursor = () => {
    lineListDom[activeLine.current].focus();
    // eslint-disable-next-line no-underscore-dangle
    const _range = document.getSelection().getRangeAt(0);
    const range = _range.cloneRange();
    range.selectNodeContents(lineListDom[activeLine.current]);
    range.setEnd(_range.endContainer, _range.endOffset);
    let pos = range.toString().length;
    let len = 0;
    setTimeout(() => {
      console.time('getNode');
      const getNode = () => {
        const queue = [linesDataRef.current[activeLine.current]];
        while (queue.length > 0) {
          const node = queue.shift();
          if (typeof node.content === 'string') {
            if (node.content !== '<br>') {
              len += node.content.length;
            } else {
              len += 1;
            }
          } else {
            node.content.forEach((item) => {
              queue.push(item);
            });
          }
          if (len >= pos
            && (node.type === EditType.MdSymbolSC || node.type === EditType.MdFrontSymbolSC)
          ) {
            pos += 1;
          }
          if (len >= pos
            && (node.type !== EditType.MdSymbolSC || node.type === EditType.MdFrontSymbolSC)
          ) return node;
        }
        return null;
      };
      const node = getNode();
      console.timeEnd('getNode');
      console.log(node);
      let offset = 0;
      if (node.content !== '<br>') offset = node.content.length - (len - pos);

      inLineTextDom.get(node).focus();
      document.getSelection().collapse(
        inLineTextDom.get(node).firstChild,
        offset,
      );
      setRendering(false);
    });
  };

  return {
    linesRenderData,
    handleKeyUp,
    handleKeyPress,
    handleKeyDown,
    rendering,
  };
};

export default useTextHandler;
