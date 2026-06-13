const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const config = {
  resolver: {
    unstable_enablePackageExports: true,
    extraNodeModules: {
      stream: path.resolve(__dirname, 'node_modules/stream-browserify'),
      crypto: path.resolve(__dirname, 'node_modules/react-native-crypto'),
      http: path.resolve(__dirname, 'node_modules/@tradle/react-native-http'),
      https: path.resolve(__dirname, 'node_modules/https-browserify'),
      buffer: path.resolve(__dirname, 'node_modules/buffer'),
      process: path.resolve(__dirname, 'node_modules/process'),
      events: path.resolve(__dirname, 'node_modules/events'),
      util: path.resolve(__dirname, 'node_modules/util'),
      assert: path.resolve(__dirname, 'node_modules/assert'),
      path: path.resolve(__dirname, 'node_modules/path-browserify'),
      querystring: path.resolve(__dirname, 'node_modules/querystring-es3'),
      zlib: path.resolve(__dirname, 'node_modules/browserify-zlib'),
      console: path.resolve(__dirname, 'node_modules/console-browserify'),
      constants: path.resolve(__dirname, 'node_modules/constants-browserify'),
      os: path.resolve(__dirname, 'node_modules/os-browserify'),
      timers: path.resolve(__dirname, 'node_modules/timers-browserify'),
      tty: path.resolve(__dirname, 'node_modules/tty-browserify'),
      vm: path.resolve(__dirname, 'node_modules/vm-browserify'),
      fs: path.resolve(__dirname, 'node_modules/react-native-level-fs'),
      dns: path.resolve(__dirname, 'node_modules/dns.js'),
      domain: path.resolve(__dirname, 'node_modules/domain-browser'),
      punycode: path.resolve(__dirname, 'node_modules/punycode'),
      _stream_readable: path.resolve(__dirname, 'node_modules/readable-stream/readable'),
      _stream_writable: path.resolve(__dirname, 'node_modules/readable-stream/writable'),
      _stream_duplex: path.resolve(__dirname, 'node_modules/readable-stream/duplex'),
      _stream_transform: path.resolve(__dirname, 'node_modules/readable-stream/transform'),
      _stream_passthrough: path.resolve(__dirname, 'node_modules/readable-stream/passthrough'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
