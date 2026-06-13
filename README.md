# React Native IPFS Demo
### Demo Video: [video](https://github.com/nikunjkumar05/react-native-ipfs-demo-latest/blob/main/demo.mp4)

A demo app showcasing [IPFS](https://ipfs.io) operations in React Native, upgraded to **React Native 0.86** with **React 19** and the New Architecture (Fabric + Hermes).

Based on [react-native-ipfs-demo](https://github.com/ipfs-shipyard/react-native-ipfs-demo) (originally RN 0.63.4).

## Features

- **ipfs.id()** — Query local node identity
- **ipfs.add()** — Upload files to IPFS
- **ipfs.cat()** — Retrieve file content by CID
- **ipfs.get()** — Download files by CID
- **ipfs.ls()** — List directory contents
- **ipfs.pubsub** — Publish messages to topics
- Generator, async generator, and ReadableStream polyfill tests

## Prerequisites

- Node.js >= 18
- [IPFS Desktop](https://docs.ipfs.tech/install/ipfs-desktop/) (Kubo running on port 5001)
- Android SDK (API 35+) with emulator or physical device
- JDK 17 (e.g. [Eclipse Temurin](https://adoptium.net/))
- React Native CLI environment set up per [official docs](https://reactnative.dev/docs/environment-setup)

## Quick Start

### 1. Install dependencies

```bash
npm install --force
```

> Patches are applied automatically via `patch-package` in the postinstall script. The postinstall also removes stale `react-native-vector-icons` codegen artifacts that conflict with RN 0.86's app-level codegen. If a patch fails to apply (e.g. after modifying upstream source), regenerate it with `npx patch-package <package-name>`.

### 2. Start IPFS Desktop

Ensure Kubo is running and the API is accessible at `http://localhost:5001`.

### 3. Start Metro bundler

```bash
npx react-native start --reset-cache
```

### 4. Build and run on Android

In a **second terminal**:

```powershell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.0.19.10-hotspot"
$env:ANDROID_HOME = "$env:LOCALAPPDATA\Android\Sdk"

cd android
.\gradlew.bat assembleDebug
```

Install and launch:

```powershell
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
adb reverse tcp:8081 tcp:8081
adb reverse tcp:5001 tcp:5001
adb shell am start -n com.ipfsdemo/.MainActivity
```

### 5. Check output

Results are logged via `console.log` — view them with:

```powershell
adb logcat -d | Select-String "ReactNativeJS"
```

## Architecture

### IPFS Client

The app uses a **raw fetch-based IPFS client** (`src/ipfs-client.js`) that talks directly to the Kubo HTTP API. This was chosen over `ipfs-http-client@60` because that library's internal HTTP pipeline (opts spreading, `duplex: 'half'`, Blob-backed FormData) is fundamentally incompatible with React Native 0.86's native fetch.

| Operation | Method | Endpoint |
|-----------|--------|----------|
| `id()` | POST | `/api/v0/id` |
| `add()` | POST | `/api/v0/add` (manual multipart) |
| `cat()` | POST | `/api/v0/cat` |
| `get()` | POST | `/api/v0/get` |
| `ls()` | POST | `/api/v0/ls` |
| `pubsub.publish()` | POST | `/api/v0/pubsub/pub` |

### Platform Config

| Platform | IPFS API URL |
|----------|-------------|
| Android emulator | `http://10.0.2.2:5001` |
| iOS simulator | `http://localhost:5001` |

### Key Patches

| Patch | Purpose |
|-------|---------|
| `ipfs-http-client+60.0.1` | Try-catch around `multiaddr()` for unsupported protocols; pubsub `reactNative` flag |
| `ipfs-utils+9.0.14` | Remove `...opts` spread and `duplex: 'half'` from fetch call |

### Node.js Polyfills

`shims/index.js` provides `web-streams-polyfill` (ReadableStream, WritableStream, TransformStream) and URL polyfills. Additional Node.js globals (`process`, `Buffer`) are provided by `shim.js` at the entry point.

## Project Structure

```
src/
  App.js                 # Provider hierarchy (Paper, Navigation, SafeArea)
  config.js              # Platform.select IPFS URL
  ipfs-client.js         # Raw fetch-based IPFS client
  ipfs-http-client.js    # Re-exports createIpfsClient()
  navigation/            # React Navigation stack
  screens/
    home/                # Menu with all demo buttons
    id/                  # ipfs.id()
    add/                 # ipfs.add()
    cat/                 # ipfs.cat()
    get/                 # ipfs.get()
    ls/                  # ipfs.ls()
    pubsub/              # ipfs.pubsub
patches/                 # patch-package fixes for ipfs-http-client and ipfs-utils
shims/                   # Web Streams polyfills
shim.js                  # Node.js globals (process, Buffer)
```

## Upgrade Notes

This project was upgraded from React Native 0.63 through 0.76 to **0.86**. Key changes:

- **New Architecture is mandatory** since RN 0.82 (`newArchEnabled=false` is ignored)
- **Hermes** is the default JS engine with generational GC (CMC)
- **Gradle 9.3.1** and **Kotlin 2.1.20** for Android builds
- **JDK 17** required for Gradle and CMake compatibility
- `react-native-fetch-api` polyfill removed — RN 0.86 has native fetch
- `react-native-nitro-modules` and `react-native-quick-crypto` removed — not needed with the raw fetch client
- `react-native-vector-icons` codegen artifacts cleaned via postinstall to avoid CMake duplicate target conflicts

## Running Tests

```bash
npm test
```

## License

MIT
