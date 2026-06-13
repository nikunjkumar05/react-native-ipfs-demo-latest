import 'react-native-get-random-values';
import 'fast-text-encoding';

const {ReadableStream} = require('web-streams-polyfill');
if (typeof globalThis.ReadableStream === 'undefined') {
  globalThis.ReadableStream = ReadableStream;
}

const URL = global.URL;
if (URL != null && URL.prototype != null) {
  Object.defineProperties(URL.prototype, {
    protocol: {
      get() {
        const match = this._url.match(/^([a-z][a-z0-9+.-]*:)/i);
        return match ? match[1] : '';
      },
      enumerable: true,
      configurable: true,
    },
    host: {
      get() {
        const match = this._url.match(/^[^:]+:\/\/([^\/?#]+)/);
        return match ? match[1] : '';
      },
      set(val) {
        this._url = this._url.replace(/(^[^:]+:\/\/)[^\/?#]+/, '$1' + val);
      },
      enumerable: true,
      configurable: true,
    },
    hostname: {
      get() {
        const match = this._url.match(/^[^:]+:\/\/([^:\/?#]+)/);
        return match ? match[1] : '';
      },
      set(val) {
        const portMatch = this._url.match(/:(\d+)(?=[\/?#]|$)/);
        const port = portMatch ? ':' + portMatch[1] : '';
        this._url = this._url.replace(/(^[^:]+:\/\/)[^:\/?#]+/, '$1' + val + port);
      },
      enumerable: true,
      configurable: true,
    },
    port: {
      get() {
        const match = this._url.match(/:(\d+)(?=[\/?#]|$)/);
        return match ? match[1] : '';
      },
      set(val) {
        const hostMatch = this._url.match(/^[^:]+:\/\/([^:\/?#]+)/);
        if (hostMatch) {
          this._url = this._url.replace(/:[^\/?#]*(\/|$)/, ':' + val + '$1');
        }
      },
      enumerable: true,
      configurable: true,
    },
    pathname: {
      get() {
        const match = this._url.match(/^[^:]+:\/\/[^\/?#]*(\/[^?#]*)/);
        return match ? match[1] : '/';
      },
      set(val) {
        const match = this._url.match(/^([^:]+:\/\/[^\/?#]*).*/);
        const base = match ? match[1] : '';
        const hashMatch = this._url.match(/(#.*)$/);
        const searchMatch = this._url.match(/(\?[^#]*)/);
        const suffix = (searchMatch ? searchMatch[1] : '') + (hashMatch ? hashMatch[1] : '');
        this._url = base + (val.startsWith('/') ? val : '/' + val) + suffix;
      },
      enumerable: true,
      configurable: true,
    },
    search: {
      get() {
        const match = this._url.match(/\?([^#]*)/);
        return match ? '?' + match[1] : '';
      },
      set(val) {
        const str = val === null || val === undefined ? '' : String(val).startsWith('?') ? String(val) : '?' + String(val);
        this._url = this._url.replace(/(\?[^#]*)?(#.*)?$/, (m, q, h) => str + (h || ''));
      },
      enumerable: true,
      configurable: true,
    },
    hash: {
      get() {
        const match = this._url.match(/#(.*)/);
        return match ? '#' + match[1] : '';
      },
      enumerable: true,
      configurable: true,
    },
    origin: {
      get() {
        const match = this._url.match(/^[^:]+:\/\/[^\/?#]+/);
        return match ? match[0] : '';
      },
      enumerable: true,
      configurable: true,
    },
    username: {
      get() {
        const match = this._url.match(/^[^:]+:\/\/([^:@]+)(?::[^@]*)?@/);
        return match ? match[1] : '';
      },
      enumerable: true,
      configurable: true,
    },
    password: {
      get() {
        const match = this._url.match(/^[^:]+:\/\/[^:]*:([^@]*)@/);
        return match ? match[1] : '';
      },
      enumerable: true,
      configurable: true,
    },
  });
}
