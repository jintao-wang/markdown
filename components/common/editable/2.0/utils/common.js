export const objectCache = () => {
  let curId = 1;
  const ids = new WeakMap();

  return (object, autoIncrease = false) => {
    if (!autoIncrease) return ids.get(object);
    if (ids.has(object)) {
      // eslint-disable-next-line consistent-return
      return ids.get(object);
    }
    // eslint-disable-next-line no-plusplus
    const id = (curId++).toString();
    ids.set(object, id);
    // eslint-disable-next-line consistent-return
    return id;
  };
};

export const getObjectId = () => {
  let curId = 1;
  const ids = new Map();

  return function (object) {
    if (!object) {
      curId = 1;
      ids.clear();
      return;
    }

    if (ids.has(object)) {
      // eslint-disable-next-line consistent-return
      return ids.get(object);
    }
    // eslint-disable-next-line no-plusplus
    const id = (curId++).toString();
    ids.set(object, id);
    // eslint-disable-next-line consistent-return
    return id;
  };
};

export const UUID8Bit = () => {
  const chars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k',
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x',
    'y', 'z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A',
    'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N',
    'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  ];

  let uuid = '';
  for (let i = 0; i < 8; ++i) {
    const index = Math.min(Math.floor(Math.random() * 62), 61);
    uuid += chars[index];
  }
  return uuid;
};

// 通过ID获取文字对象并添加缓存
export const getWordObj = (linesData, targetId) => {
  if (!targetId) return null;
  const queue = [...linesData];
  while (queue.length > 0) {
    const node = queue.shift();
    if (node.id === targetId) return node;
    if (typeof node.content === 'object') {
      node.content.forEach((item) => {
        queue.push(item);
      });
    }
  }
  return null;
};
