import * as EditType from '../edit_type';

export const getLineType = (symbol) => {
  switch (symbol) {
    case '#':
      return EditType.H1SC;
    case '##':
      return EditType.H2SC;
    case '###':
      return EditType.H3SC;
    case '####':
      return EditType.H4SC;
    case '#####':
      return EditType.H5SC;
    case '######':
      return EditType.H6SC;
    default:
      return EditType.PSC;
  }
};
