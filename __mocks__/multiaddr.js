const multiaddr = jest.fn((str) => ({ toString: () => str, encapsulate: () => multiaddr(str) }));

module.exports = { multiaddr, default: multiaddr };
