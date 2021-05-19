export const cachingDecorator = (func) => {
  const cache = new Map();
  return function (...args) {
    const key = hash(...args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
};

function hash(...args) {
  return args.join();
}

