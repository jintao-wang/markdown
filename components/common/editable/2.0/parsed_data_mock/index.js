import { UUID8Bit } from '../utils/common';
import * as EditType from '../edit_type';

export const dataMock1 = [
  {
    type: EditType.PSC,
    content: [
      {
        type: EditType.PlainSC,
        content: 'wang',
        id: UUID8Bit(),
      },
      {
        type: EditType.PlainSC,
        content: [
          {
            type: EditType.MdSymbolSC,
            content: '`',
            id: UUID8Bit(),
          },
          {
            type: EditType.CodeSC,
            content: [
              {
                type: EditType.PlainSC,
                content: 'code',
                id: UUID8Bit(),
              },
            ],
            id: UUID8Bit(),
          },
          {
            type: EditType.MdSymbolSC,
            content: '`',
            id: UUID8Bit(),
          },
        ],
        id: UUID8Bit(),
      },
      {
        type: EditType.PlainSC,
        content: 'jintao',
        id: UUID8Bit(),
      },
    ],
    id: UUID8Bit(),
  },
  {
    type: EditType.PSC,
    content: [
      {
        type: EditType.CodeSC,
        content: 'hhh',
        id: UUID8Bit(),
      },
      {
        type: EditType.PlainSC,
        content: [
          {
            type: EditType.MdSymbolSC,
            content: '==',
            id: UUID8Bit(),
          },
          {
            type: EditType.MarkSC,
            content: [
              {
                type: EditType.PlainSC,
                content: 'wangjitnao',
                id: UUID8Bit(),
              },
            ],
            id: UUID8Bit(),
          },
          {
            type: EditType.MdSymbolSC,
            content: '==',
            id: UUID8Bit(),
          },
        ],
        id: UUID8Bit(),
      },
      {
        type: EditType.MarkSC,
        content: 'hsass',
        id: UUID8Bit(),
      },
    ],
    id: UUID8Bit(),
  },
];

export const dataMock2 = [
  {
    type: EditType.H1SC,
    content: [
      {
        type: EditType.MdFrontSymbolSC,
        content: '###',
        id: UUID8Bit(),
      },
      {
        type: EditType.PlainSC,
        content: 'jintao',
        id: UUID8Bit(),
      },
    ],
    id: UUID8Bit(),
  },
];

export const dataMockInitial = [
  {
    type: EditType.PSC,
    content: [
      {
        type: EditType.PlainSC,
        content: '<br>',
      },
    ],
  },
];
