const mockClient = {
  id: jest.fn(() => Promise.resolve({ id: 'mock-peer-id', addresses: [] })),
  add: jest.fn(() => Promise.resolve({ path: '/mock', hash: 'QmMock' })),
  cat: jest.fn(function* () { yield new Uint8Array([1, 2, 3]); }),
  get: jest.fn(function* () { yield { path: 'mock-file', content: (function* () { yield new Uint8Array([1, 2, 3]); })() }; }),
  ls: jest.fn(function* () { yield { name: 'mock', type: 'file', size: 0, hash: 'QmMock' }; }),
  pubsub: {
    subscribe: jest.fn(() => Promise.resolve()),
    unsubscribe: jest.fn(() => Promise.resolve()),
    publish: jest.fn(() => Promise.resolve()),
  },
  swarm: {
    connect: jest.fn(() => Promise.resolve()),
    disconnect: jest.fn(() => Promise.resolve()),
  },
};

const create = jest.fn(() => mockClient);

module.exports = { create, default: create };
