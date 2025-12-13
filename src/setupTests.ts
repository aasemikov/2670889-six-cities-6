import '@testing-library/jest-dom';

const originalWarn = console.warn;
const allowedWarnings = [
  'React Router Future Flag Warning',
];
console.warn = (...args) => {
  if (allowedWarnings.some((warning) => args[0]?.includes?.(warning))) {
    return;
  }
  originalWarn(...args);
};

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value.toString();
    },
    removeItem(key: string) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index: number) {
      const keys = Object.keys(store);
      return keys[index] || null;
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

beforeEach(() => {
  localStorageMock.clear();
});
