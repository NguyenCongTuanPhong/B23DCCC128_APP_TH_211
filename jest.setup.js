/* eslint-env jest */

jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock.js'),
);

jest.mock('@react-native-async-storage/async-storage', () => {
  const storage = new Map();

  return {
    getItem: jest.fn(async key => (storage.has(key) ? storage.get(key) : null)),
    setItem: jest.fn(async (key, value) => storage.set(key, value)),
    removeItem: jest.fn(async key => storage.delete(key)),
    clear: jest.fn(async () => storage.clear()),
    getAllKeys: jest.fn(async () => Array.from(storage.keys())),
  };
});
