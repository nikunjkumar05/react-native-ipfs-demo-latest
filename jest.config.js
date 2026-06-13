module.exports = {
  preset: 'react-native',
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|ipfs-http-client|@multiformats)/)',
  ],
  moduleNameMapper: {
    '\\.png$': '<rootDir>/__mocks__/fileMock.js',
    '^ipfs-http-client$': '<rootDir>/__mocks__/ipfs-http-client.js',
    '^@multiformats/multiaddr$': '<rootDir>/__mocks__/multiaddr.js',
  },
};
