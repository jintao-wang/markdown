import * as EditType from '../edit_type';

const parseLineText = (lineText) => {
  const lineRenderData = {
    type: EditType.PSC,
    content: [],
  };

  // 检查行类型
  const checkLineType = () => {
    if (lineText.startsWith('######') && lineText.charCodeAt(6)) {
      lineRenderData.type = EditType.H6SC;
      lineRenderData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '###### ',
        },
      );
      return lineText.slice(7);
    }

    if (lineText.startsWith('#####') && lineText.charCodeAt(5)) {
      lineRenderData.type = EditType.H5SC;
      lineRenderData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '##### ',
        },
      );
      return lineText.slice(6);
    }

    if (lineText.startsWith('####') && lineText.charCodeAt(4)) {
      lineRenderData.type = EditType.H4SC;
      lineRenderData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '#### ',
        },
      );
      return lineText.slice(5);
    }

    if (lineText.startsWith('###') && lineText.charCodeAt(3)) {
      lineRenderData.type = EditType.H3SC;
      lineRenderData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '### ',
        },
      );
      return lineText.slice(4);
    }

    if (lineText.startsWith('##') && lineText.charCodeAt(2)) {
      lineRenderData.type = EditType.H2SC;
      lineRenderData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '## ',
        },
      );
      return lineText.slice(3);
    }

    if (lineText.startsWith('#') && lineText.charCodeAt(1)) {
      lineRenderData.type = EditType.H1SC;
      lineRenderData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '# ',
        },
      );
      return lineText.slice(2);
    }

    return lineText;
  };

  // 检查行内markdown语法
  const checkInlineMarkdown = (parseText, parentData) => {
    for (let charIndex = 0, len = parseText.length; charIndex < len; charIndex++) {
      switch (parseText[charIndex]) {
        case '`':
        {
          let symbol = '';
          let nextSymbolIndex = -1;

          // 匹配真实的symbol
          for (let symbolIndex = charIndex; symbolIndex < len; symbolIndex++) {
            if (parseText[symbolIndex] === '`') {
              const newSymbol = `${symbol}\``;
              const newNextSymbolIndex = parseText.indexOf(
                newSymbol,
                charIndex + newSymbol.length + 1,
              );
              if (newNextSymbolIndex === -1) break;
              symbol = newSymbol;
              nextSymbolIndex = newNextSymbolIndex;
            } else {
              break;
            }
          }

          if (nextSymbolIndex === -1) break;
          if (typeof parentData.content === 'string') {
            parentData.content = [];
          }

          // 截取前面的字符
          const text = parseText.substring(0, charIndex);
          parentData.content.push(
            {
              type: EditType.PlainSC,
              content: text,
            },
          );
          // 截取有效的code字符
          const inMarkDownText = parseText.substring(charIndex + symbol.length, nextSymbolIndex);
          parentData.content.push(
            {
              type: EditType.MdSymbolSC,
              content: symbol,
            },
            {
              type: EditType.CodeSC,
              content: inMarkDownText,
            },
            {
              type: EditType.MdSymbolSC,
              content: symbol,
            },
          );
          // const codeSpan = {
          //   type: EditType.PlainSC,
          //   content: [],
          // };
          // codeSpan.content.push(
          //   {
          //     type: EditType.MdSymbolSC,
          //     content: symbol,
          //   },
          //   {
          //     type: EditType.CodeSC,
          //     content: inMarkDownText,
          //   },
          //   {
          //     type: EditType.MdSymbolSC,
          //     content: symbol,
          //   },
          // );
          // parentData.content.push(codeSpan);
          // 截取剩下的字符继续处理
          parseText = parseText.slice(nextSymbolIndex + symbol.length);
          if (parseText.length) {
            return checkInlineMarkdown(parseText, parentData);
          }
          return '';
        }
        case '=':
        {
          if (parseText[charIndex + 1] !== '=') break;
          const nextSymbolIndex = parseText.indexOf(
            '==',
            charIndex + 2 + 1,
          );
          if (nextSymbolIndex === -1) break;
          if (typeof parentData.content === 'string') {
            parentData.content = [];
          }
          // 截取前面的字符
          const text = parseText.substring(0, charIndex);
          parentData.content.push(
            {
              type: EditType.PlainSC,
              content: text,
            },
          );
          // 截取有效的code字符
          const inMarkDownText = parseText.substring(charIndex + 2, nextSymbolIndex);
          const newParent = {
            type: EditType.MarkSC,
            content: inMarkDownText,
          };
          parentData.content.push(
            {
              type: EditType.MdSymbolSC,
              content: '==',
            },
            newParent,
            {
              type: EditType.MdSymbolSC,
              content: '==',
            },
          );
          const unhandledText = checkInlineMarkdown(inMarkDownText, newParent);
          if (unhandledText !== inMarkDownText) {
            parentData.content.push(
              {
                type: EditType.PlainSC,
                content: unhandledText,
              },
            );
          }
          // 截取剩下的字符继续处理
          parseText = parseText.slice(nextSymbolIndex + 2);
          if (parseText.length) {
            return checkInlineMarkdown(parseText, parentData);
          }
          return '';
        }
        case '~':
        {
          if (parseText[charIndex + 1] !== '~') break;
          const nextSymbolIndex = parseText.indexOf(
            '~~',
            charIndex + 2 + 1,
          );
          if (nextSymbolIndex === -1) break;
          if (typeof parentData.content === 'string') {
            parentData.content = [];
          }
          // 截取前面的字符
          const text = parseText.substring(0, charIndex);
          parentData.content.push(
            {
              type: EditType.PlainSC,
              content: text,
            },
          );
          // 截取有效的code字符
          const inMarkDownText = parseText.substring(charIndex + 2, nextSymbolIndex);
          const newParent = {
            type: EditType.DelSC,
            content: inMarkDownText,
          };
          parentData.content.push(
            {
              type: EditType.MdSymbolSC,
              content: '~~',
            },
            newParent,
            {
              type: EditType.MdSymbolSC,
              content: '~~',
            },
          );
          const unhandledText = checkInlineMarkdown(inMarkDownText, newParent);
          if (unhandledText !== inMarkDownText) {
            parentData.content.push(
              {
                type: EditType.PlainSC,
                content: unhandledText,
              },
            );
          }
          // 截取剩下的字符继续处理
          parseText = parseText.slice(nextSymbolIndex + 2);
          if (parseText.length) {
            return checkInlineMarkdown(parseText, parentData);
          }
          return '';
        }
        case '*':
        {
          let symbol = '';
          let nextSymbolIndex = -1;

          // 匹配真实的symbol
          for (let symbolIndex = charIndex; symbolIndex < parseText.length; symbolIndex++) {
            if (parseText[symbolIndex] === '*') {
              const newSymbol = `${symbol}*`;
              const newNextSymbolIndex = parseText.indexOf(
                newSymbol,
                charIndex + newSymbol.length + 1,
              );
              if (newNextSymbolIndex === -1) break;
              symbol = newSymbol;
              nextSymbolIndex = newNextSymbolIndex;
              if (newSymbol.length >= 3) break;
            } else {
              break;
            }
          }

          if (nextSymbolIndex === -1) break;
          if (typeof parentData.content === 'string') {
            parentData.content = [];
          }

          // 截取前面的字符
          const text = parseText.substring(0, charIndex);
          parentData.content.push(
            {
              type: EditType.PlainSC,
              content: text,
            },
          );
          // 截取有效的code字符
          const inMarkDownText = parseText.substring(charIndex + symbol.length, nextSymbolIndex);
          let newParent = null;
          if (symbol.length === 1) {
            newParent = {
              type: EditType.EmSC,
              content: inMarkDownText,
            };
          } else if (symbol.length === 2) {
            newParent = {
              type: EditType.BoldSC,
              content: inMarkDownText,
            };
          } else if (symbol.length === 3) {
            newParent = {
              type: EditType.EmBoldSC,
              content: inMarkDownText,
            };
          }

          parentData.content.push(
            {
              type: EditType.MdSymbolSC,
              content: symbol,
            },
            newParent,
            {
              type: EditType.MdSymbolSC,
              content: symbol,
            },
          );
          const unhandledText = checkInlineMarkdown(inMarkDownText, newParent);
          if (unhandledText !== inMarkDownText) {
            parentData.content.push(
              {
                type: EditType.PlainSC,
                content: unhandledText,
              },
            );
          }
          // 截取剩下的字符继续处理
          parseText = parseText.slice(nextSymbolIndex + symbol.length);
          if (parseText.length) {
            return checkInlineMarkdown(parseText, parentData);
          }
          return '';
        }
        default:
      }
    }
    return parseText;
  };

  lineText = checkLineType();
  lineText = checkInlineMarkdown(lineText, lineRenderData);

  lineRenderData.content.push({
    type: EditType.PlainSC,
    content: lineText || '<br>',
  });

  console.log(lineRenderData);
  return lineRenderData;
};

export default parseLineText;
