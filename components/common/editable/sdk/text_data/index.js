import { UUID8Bit } from '../utils/common';
import * as EditType from '../edit_type';

const GetInitialData = () => dataInitial;

export default GetInitialData;

const newData = () => ({
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
});

const dataMock1 = [
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

const dataMock2 = [
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

const dataInitial = [
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

const markdownText = '### markdown解析\n'
  + '\n'
  + '解析==高亮==\n'
  + '\n'
  + '解析`code`\n'
  + '\n'
  + '解析**加粗**\n'
  + '\n'
  + '解析*斜体*\n'
  + '\n'
  + '解析***斜体加粗***\n'
  + '\n'
  + '解析~~删除线~~\n'
  + '\n'
  + '> 解析引用';
