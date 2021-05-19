import * as EditType from './edit_type';
import { UUID8Bit } from '../../../../tools/common';
import { cachingDecorator } from '../../../../tools/decorate';
import { getLineType } from './utils/symbolToType';
import { getWordObj } from './utils/common';
import { MdFrontSymbolSC } from './edit_type';
import GetInitialData from './text_data';
import LineTypeHandle from './line_type_handle';
import GetMarkdownText from './markdown_data';

export default class TextHandler {
  constructor(renderUpdate, markdownText) {
    this.renderUpdate = renderUpdate;

    // 记录每行文字的数据解构
    this.linesData = GetInitialData();
    // 记录每行文字的虚拟dom
    this.lineListRef = [];
    this.markdownText = markdownText;

    this.activeLine = 0; // 当前光标所在行

    this.markdownCheck = []; // 检查是否出现markdown语法
    this.lineTypeCheck = null; // 检查标题

    this.selectedWordId = null; // 当前选择文本对象的ID;
    this.selectedWord = null; // 当前选择的文本对象;
  }

  static getWordObj = cachingDecorator(getWordObj);

  static parseLineText(lineText, lineData, renderUpdate, setCursor) {
    lineData.content = [];
    // 检查header
    if (lineText.startsWith('######')) {
      lineData.type = EditType.H6SC;
      lineText = lineText.slice(6);
      lineData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '###### ',
          id: UUID8Bit(),
        },
        {
          type: EditType.PlainSC,
          content: lineText.length ? lineText : '</br>',
          id: UUID8Bit(),
        },
      );
    } else if (lineText.startsWith('#####')) {
      lineData.type = EditType.H5SC;
      lineText = lineText.slice(5);
      lineData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '##### ',
          id: UUID8Bit(),
        },
        {
          type: EditType.PlainSC,
          content: lineText.length ? lineText : '</br>',
          id: UUID8Bit(),
        },
      );
    } else if (lineText.startsWith('####')) {
      lineData.type = EditType.H4SC;
      lineText = lineText.slice(4);
      lineData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '#### ',
          id: UUID8Bit(),
        },
        {
          type: EditType.PlainSC,
          content: lineText.length ? lineText : '</br>',
          id: UUID8Bit(),
        },
      );
    } else if (lineText.startsWith('###')) {
      lineData.type = EditType.H3SC;
      lineText = lineText.slice(3);
      lineData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '### ',
          id: UUID8Bit(),
        },
        {
          type: EditType.PlainSC,
          content: lineText.length ? lineText : '</br>',
          id: UUID8Bit(),
        },
      );
    } else if (lineText.startsWith('##')) {
      lineData.type = EditType.H2SC;
      lineText = lineText.slice(2);
      lineData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '## ',
          id: UUID8Bit(),
        },
        {
          type: EditType.PlainSC,
          content: lineText.length ? lineText : '</br>',
          id: UUID8Bit(),
        },
      );
    } else if (lineText.startsWith('#')) {
      lineData.type = EditType.H1SC;
      lineText = lineText.slice(1);
      lineData.content.push(
        {
          type: EditType.MdFrontSymbolSC,
          content: '# ',
          id: UUID8Bit(),
        },
        {
          type: EditType.PlainSC,
          content: lineText.length ? lineText : '</br>',
          id: UUID8Bit(),
        },
      );
    } else {
      lineData.type = EditType.PSC;
    }

    const handleParseText = (parseText, parentData) => {
      for (let charIndex = 0; charIndex < parseText.length; charIndex++) {
        switch (parseText[charIndex]) {
          case '`':
          {
            let symbol = '';
            let nextSymbolIndex = -1;

            // 匹配真实的symbol
            for (let symbolIndex = charIndex; symbolIndex < parseText.length; symbolIndex++) {
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
                id: UUID8Bit(),
              },
            );
            // 截取有效的code字符
            const inMarkDownText = parseText.substring(charIndex + symbol.length, nextSymbolIndex);
            parentData.content.push(
              {
                type: EditType.MdSymbolSC,
                content: symbol,
                id: UUID8Bit(),
              },
              {
                type: EditType.CodeSC,
                content: inMarkDownText,
                id: UUID8Bit(),
              },
              {
                type: EditType.MdSymbolSC,
                content: symbol,
                id: UUID8Bit(),
              },
            );
            // 截取剩下的字符继续处理
            parseText = parseText.slice(nextSymbolIndex + symbol.length);
            if (parseText.length) {
              return handleParseText(parseText, parentData);
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
                id: UUID8Bit(),
              },
            );
            // 截取有效的code字符
            const inMarkDownText = parseText.substring(charIndex + 2, nextSymbolIndex);
            const newParent = {
              type: EditType.MarkSC,
              content: inMarkDownText,
              id: UUID8Bit(),
            };
            parentData.content.push(
              {
                type: EditType.MdSymbolSC,
                content: '==',
                id: UUID8Bit(),
              },
              newParent,
              {
                type: EditType.MdSymbolSC,
                content: '==',
                id: UUID8Bit(),
              },
            );
            const unhandledText = handleParseText(inMarkDownText, newParent);
            if (unhandledText !== inMarkDownText) {
              parentData.content.push(
                {
                  type: EditType.PlainSC,
                  content: unhandledText,
                  id: UUID8Bit(),
                },
              );
            }
            // 截取剩下的字符继续处理
            parseText = parseText.slice(nextSymbolIndex + 2);
            if (parseText.length) {
              return handleParseText(parseText, parentData);
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
                id: UUID8Bit(),
              },
            );
            // 截取有效的code字符
            const inMarkDownText = parseText.substring(charIndex + 2, nextSymbolIndex);
            const newParent = {
              type: EditType.DelSC,
              content: inMarkDownText,
              id: UUID8Bit(),
            };
            parentData.content.push(
              {
                type: EditType.MdSymbolSC,
                content: '~~',
                id: UUID8Bit(),
              },
              newParent,
              {
                type: EditType.MdSymbolSC,
                content: '~~',
                id: UUID8Bit(),
              },
            );
            const unhandledText = handleParseText(inMarkDownText, newParent);
            if (unhandledText !== inMarkDownText) {
              parentData.content.push(
                {
                  type: EditType.PlainSC,
                  content: unhandledText,
                  id: UUID8Bit(),
                },
              );
            }
            // 截取剩下的字符继续处理
            parseText = parseText.slice(nextSymbolIndex + 2);
            if (parseText.length) {
              return handleParseText(parseText, parentData);
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
                id: UUID8Bit(),
              },
            );
            // 截取有效的code字符
            const inMarkDownText = parseText.substring(charIndex + symbol.length, nextSymbolIndex);
            let newParent = null;
            if (symbol.length === 1) {
              newParent = {
                type: EditType.EmSC,
                content: inMarkDownText,
                id: UUID8Bit(),
              };
            } else if (symbol.length === 2) {
              newParent = {
                type: EditType.BoldSC,
                content: inMarkDownText,
                id: UUID8Bit(),
              };
            } else if (symbol.length === 3) {
              newParent = {
                type: EditType.EmBoldSC,
                content: inMarkDownText,
                id: UUID8Bit(),
              };
            }

            parentData.content.push(
              {
                type: EditType.MdSymbolSC,
                content: symbol,
                id: UUID8Bit(),
              },
              newParent,
              {
                type: EditType.MdSymbolSC,
                content: symbol,
                id: UUID8Bit(),
              },
            );
            const unhandledText = handleParseText(inMarkDownText, newParent);
            if (unhandledText !== inMarkDownText) {
              parentData.content.push(
                {
                  type: EditType.PlainSC,
                  content: unhandledText,
                  id: UUID8Bit(),
                },
              );
            }
            // 截取剩下的字符继续处理
            parseText = parseText.slice(nextSymbolIndex + symbol.length);
            if (parseText.length) {
              return handleParseText(parseText, parentData);
            }
            return '';
          }
        }
      }
      return parseText;
    };

    lineText = handleParseText(lineText, lineData);

    lineData.content.push(
      {
        type: EditType.PlainSC,
        content: lineText,
        id: UUID8Bit(),
      },
    );

    let pos = 0;
    while (true) {
      const foundPos = lineText.indexOf('`', pos);
      if (foundPos === -1) break;

      console.log(lineText.indexOf('`', pos));
      pos = foundPos + 1; // 继续从下一个位置查找
    }
    renderUpdate();
    setCursor(lineText);
  }

  buildNewLine() {
    this.markdownCheck.length = 0; // 清空markdown语法检查

    const newLine = {
      type: EditType.PSC,
      content: [
        {
          type: EditType.PlainSC,
          content: '<br>',
          id: UUID8Bit(),
        },
      ],
      id: UUID8Bit(),
    };

    this.linesData.splice(this.activeLine + 1, 0, newLine);
  }

  onSelect(e) {

  }

  onKeyUp(e) {
    // const keyCode = e.keyCode || e.which || e.charCode;
    // const { ctrlKey, metaKey, shiftKey } = e;
    //
    // // 获取光标所在的标签
    // const selection = window.getSelection();
    // const { baseNode } = selection;
    // const range = selection.getRangeAt(0);
    //
    // const lineText = this.lineListRef[this.activeLine].innerText;
    //
    // // 获取标签的id
    // this.selectedWordId = baseNode.parentNode.getAttribute('id');
    //
    // // 通过标签id检索到虚拟文字对象
    // this.selectedWord = TextHandler.getWordObj(this.linesData, this.selectedWordId);
    //
    // // 检查行类型
    // if (
    //   this.linesData[this.activeLine].type === EditType.PSC
    //   && lineText[0] === '#'
    //   && e.key === ' '
    // ) {
    //   TextHandler.parseLineText(lineText, this.linesData[this.activeLine], this.renderUpdate);
    // }

    // if (this.selectedWord.type === EditType.MdFrontSymbolSC) {
    //   TextHandler.parseLineText(lineText, this.linesData[this.activeLine]);
    // }

    // if (this.selectedWord) {
    //   this.selectedWord.content = window.getSelection().focusNode.textContent;
    // } else {
    //   this.wordsNoClassification = baseNode.data;
    // }
    //
    // // 获取当前line
    // const currentLineData = this.linesData[this.activeLine];
    //
    // switch (keyCode) {
    //   // 捕捉空格键位，解析markdown语法
    //   case 32:
    //     if (currentLineData.content[0].type === EditType.MdFrontSymbolSC) return;
    //     this.checkLineSymbol(this.lineListRef[this.activeLine], () => e.preventDefault());
    //     break;
    //   // 捕捉删除键位, 光标已经进入新的this.selectedWord
    //   case 8:
    //     if (!this.selectedWord || this.selectedWord.type !== EditType.MdFrontSymbolSC) return;
    //     setTimeout(() => this.checkLineSymbol(this.lineListRef[this.activeLine], null));
    //     break;
    //   default:
    //   // console.log('KeyDown');
    // }
  }

  onKeyPress(e) {
    const keyCode = e.keyCode || e.which || e.charCode;
    const { ctrlKey, metaKey, shiftKey } = e;
    // console.log(keyCode);
  }

  onKeyDown(e) {
    const keyCode = e.keyCode || e.which || e.charCode;
    const { ctrlKey, metaKey, shiftKey } = e;

    const lineText = this.lineListRef[this.activeLine].innerText;

    if (e.key === 's' && ctrlKey) {
      console.time('解析一行时间');
      TextHandler.parseLineText(
        lineText,
        this.linesData[this.activeLine],
        this.renderUpdate,
      );
      console.timeEnd('解析一行时间');
    }

    // 检查行类型(有用)
    if (
      this.linesData[this.activeLine].type === EditType.PSC
      && lineText[0] === '#'
      && e.key === ' '
    ) {
      e.preventDefault();

      // 定义设置光标的方法
      const setCursor = (lineTextSliced) => {
        if (lineTextSliced.length) {
          // 重新渲染后，光标移到一行最后面
          setTimeout(() => {
            const setDom = this.lineListRef[this.activeLine].childNodes[1].firstChild;
            const selection = window.getSelection();
            const { baseNode } = selection;
            const range = selection.getRangeAt(0);
            range.setStart(setDom, 0);
            range.setEnd(setDom, 0);
          });
        } else {
          setTimeout(() => {
            const setDom = this.lineListRef[this.activeLine].childNodes[1].firstChild;
            const selection = window.getSelection();
            const { baseNode } = selection;
            const range = selection.getRangeAt(0);
            range.setStart(setDom, 0);
            range.setEnd(setDom, 0);
          });
        }
      };
      TextHandler.parseLineText(
        lineText,
        this.linesData[this.activeLine],
        this.renderUpdate,
        setCursor,
      );
    }

    if (this.linesData[this.activeLine].type !== EditType.PSC) {
      setTimeout(() => {
        if (this.lineListRef[this.activeLine].childNodes[1].innerText.length === 1 || this.lineListRef[this.activeLine].childNodes[1].innerText.codePointAt(0) !== 160) return;
        const textDom = this.lineListRef[this.activeLine].childNodes[1].firstChild;
        const newRange = new Range();
        newRange.setStart(textDom, 0);
        newRange.setEnd(textDom, 1);

        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(newRange);

        newRange.deleteContents();
        newRange.setStart(textDom, 1);
        newRange.setEnd(textDom, 1);

        newRange.collapse(false);
        sel.removeAllRanges();
        sel.addRange(newRange);
      });
    }
  }

  checkLineSymbol(lineDom, preventDefault) {
    const lineText = lineDom.innerText.trim();
    let symbol = '';
    // 检查 #
    if (lineText.startsWith('#')) {
      // eslint-disable-next-line no-restricted-syntax
      for (const char of lineText) {
        if (char !== '#') break;
        symbol += '#';
      }
      // eslint-disable-next-line no-unused-expressions
      preventDefault && preventDefault();
      this.changeLineType(symbol);
    }
  }

  // 设置光标位置
  static setRange(textDom, position) {
    const range = new Range();
    range.setStart(textDom, position);
    range.setEnd(textDom, position);

    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  changeLineType(symbol) {
    // 获取当前line
    const currentLineData = this.linesData[this.activeLine];

    if (currentLineData.content[0].type === EditType.MdFrontSymbolSC) {
      if (currentLineData.type === getLineType(symbol)) {
        currentLineData.content[0].type = EditType.PlainSC;
        currentLineData.type = EditType.PSC;
      } else {
        currentLineData.content[0].content = symbol;
        currentLineData.type = getLineType(symbol);
      }
    } else {
      currentLineData.content.unshift({
        type: EditType.MdFrontSymbolSC,
        content: symbol,
        id: UUID8Bit(),
        parent: currentLineData,
      });

      currentLineData.type = getLineType(symbol);

      this.selectedWord.content = '&nbsp';
    }

    this.renderUpdate();

    // 重新渲染后，光标移到一行最后面
    setTimeout(() => {
      if (document.getElementById(this.selectedWordId)) {
        const setDom = document.getElementById(this.selectedWordId).firstChild;
        TextHandler.setRange(setDom);
      }
    });
  }

  setLineListRef(e, index) {
    this.lineListRef[index] = e;
  }
}
