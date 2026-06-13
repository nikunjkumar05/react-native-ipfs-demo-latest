import {HTTP_CLIENT_URL} from './config';

const apiBase = `${HTTP_CLIENT_URL}/api/v0`;

const post = async (endpoint, params = {}) => {
  const url = new URL(`${apiBase}/${endpoint}`);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null) {
      url.searchParams.set(k, String(v));
    }
  });
  const res = await fetch(url.toString(), {method: 'POST'});
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`${endpoint} failed (${res.status}): ${text}`);
  }
  return res;
};

const postJson = async (endpoint, params = {}) => {
  const res = await post(endpoint, params);
  return res.json();
};

const postNdjson = async function* (endpoint, params = {}) {
  const res = await post(endpoint, params);
  const text = await res.text();
  const lines = text.split('\n').filter(l => l.trim());
  for (const line of lines) {
    try {
      yield JSON.parse(line);
    } catch (e) {
      // skip non-JSON lines
    }
  }
};

export const createIpfsClient = () => ({
  id: async () => {
    const data = await postJson('id');
    return {
      id: data.ID,
      publicKey: data.PublicKey,
      addresses: data.Addresses || [],
      agentVersion: data.AgentVersion,
      protocolVersion: data.ProtocolVersion,
    };
  },

  add: async (file) => {
    const content = file.content;
    const path = file.path || 'file';

    const boundary = `----IPFSBoundary${Date.now()}`;
    let bodyParts = [];

    let contentBytes;
    if (typeof content === 'string') {
      contentBytes = new TextEncoder().encode(content);
    } else if (content instanceof Uint8Array) {
      contentBytes = content;
    } else if (content instanceof ArrayBuffer) {
      contentBytes = new Uint8Array(content);
    } else if (Array.isArray(content)) {
      contentBytes = new Uint8Array(content);
    } else if (content instanceof Blob) {
      const arrayBuffer = await content.arrayBuffer();
      contentBytes = new Uint8Array(arrayBuffer);
    } else {
      contentBytes = new TextEncoder().encode(String(content));
    }

    const encoder = new TextEncoder();
    const parts = [];
    parts.push(encoder.encode(`--${boundary}\r\n`));
    parts.push(encoder.encode(`Content-Disposition: form-data; name="file"; filename="${encodeURIComponent(path)}"\r\n`));
    parts.push(encoder.encode(`Content-Type: application/octet-stream\r\n\r\n`));
    parts.push(contentBytes);
    parts.push(encoder.encode(`\r\n--${boundary}--\r\n`));

    let totalLength = 0;
    for (const part of parts) totalLength += part.byteLength;
    const body = new Uint8Array(totalLength);
    let offset = 0;
    for (const part of parts) {
      body.set(part, offset);
      offset += part.byteLength;
    }

    const res = await fetch(`${apiBase}/add?stream-channels=true`, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: body,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`add failed (${res.status}): ${text}`);
    }
    const text = await res.text();
    const data = JSON.parse(text.trim().split('\n').pop());
    return {
      path: data.Name,
      hash: data.Hash,
      cid: {toString: () => data.Hash},
      size: parseInt(data.Size, 10),
    };
  },

  cat: async function* (cid) {
    const res = await post('cat', {arg: cid.toString()});
    const buffer = await res.arrayBuffer();
    yield new Uint8Array(buffer);
  },

  get: async function* (cid) {
    const res = await post('get', {arg: cid.toString()});
    const buffer = await res.arrayBuffer();
    yield {
      path: cid.toString(),
      content: [new Uint8Array(buffer)],
      type: 'file',
    };
  },

  ls: async function* (cid) {
    const cidStr = cid.toString ? cid.toString() : cid;
    const url = `${apiBase}/ls?arg=${encodeURIComponent(cidStr)}`;
    const res = await fetch(url, {method: 'POST'});
    const text = await res.text();
    const data = JSON.parse(text);
    const objects = data.Objects || [];
    for (const obj of objects) {
      const entries = obj.Links || obj.Entries || [];
      for (const entry of entries) {
        yield {
          name: entry.Name,
          type: entry.Type === 1 ? 'dir' : 'file',
          size: entry.Size,
          cid: entry.Hash,
        };
      }
    }
  },

  pubsub: {
    subscribe: async (topic, handler, options = {}) => {
      console.log('Demo App pubsub.subscribe not yet implemented for raw client');
    },
    unsubscribe: async (topic, handler) => {
      console.log('Demo App pubsub.unsubscribe not yet implemented for raw client');
    },
    publish: async (topic, data) => {
      const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
      const blob = new Blob([bytes], {type: 'application/octet-stream'});
      const formData = new FormData();
      formData.append('data', blob, 'data');
      const res = await fetch(`${apiBase}/pubsub/pub?arg=${encodeURIComponent(topic)}`, {
        method: 'POST',
        body: formData,
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`pubsub publish failed (${res.status}): ${text}`);
      }
    },
  },

  swarm: {
    connect: async (addr) => {
      const addrStr = typeof addr === 'string' ? addr : addr.toString();
      await post('swarm/connect', {arg: addrStr});
    },
    disconnect: async (addr) => {
      const addrStr = typeof addr === 'string' ? addr : addr.toString();
      await post('swarm/disconnect', {arg: addrStr});
    },
  },
});
