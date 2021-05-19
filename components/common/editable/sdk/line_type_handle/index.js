import * as EditType from '../edit_type';
import TextHandler from '../TextHandler';

const LineTypeHandle = ({
  currentLine,
  currentLineRef,
  lineText,
  event,
  renderUpdate,
}) => {
  // 检查行类型
  if (
    currentLine.type === EditType.PSC
    && lineText[0] === '#'
    && event.key === ' '
  ) {
    event.preventDefault();
    TextHandler.parseLineText(lineText, currentLine, renderUpdate);

    // 重新渲染后，光标移到一行最后面
    setTimeout(() => {
      const setDom = document.getElementById(currentLineRef.id).childNodes[1];
      TextHandler.setRange(setDom, 1);
    });
  }
};

export default LineTypeHandle;
