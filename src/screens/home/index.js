import React, {useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';

const HomeScreen = ({navigation}) => {
  const [output, setOutput] = useState('');

  const runGenerator = () => {
    const generator = function* () {
      yield* Array(5)
        .fill()
        .map((_, i) => i);
    };

    const lines = [];
    for (const i of generator()) {
      lines.push(`generator: ${i}`);
      console.log(`generator: ${i}`);
    }
    setOutput(lines.join('\n'));
  };

  const runAsyncGenerator2 = async () => {
    const generator = async function* () {
      var stream = [Promise.resolve(4), Promise.resolve(9), Promise.resolve(12)];
      var total = 0;
      for await (let val of stream) {
        total += await val;
        yield total;
      }
    };

    const lines = [];
    for await (const i of generator()) {
      lines.push(`asyncGenerator2: ${i}`);
      console.log(`asyncGenerator2: ${i}`);
    }
    setOutput(lines.join('\n'));
  };

  const readableStreamTest1 = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let controller;

    const rs = new ReadableStream({
      async pull(c) {
        controller = c;
        await delay(250);
        c.enqueue('readable');
        await delay(250);
        c.enqueue('stream');
        await delay(250);
        c.enqueue('polyfill');
        c.close();
      },
    });

    const reader = rs.getReader();
    const lines = [];

    const read = () => {
      return reader
        .read()
        .then(({done, value}) => {
          if (done) {
            lines.push('readableStreamTest1 done');
            console.log('readableStreamTest1 done');
            setOutput(lines.join('\n'));
            return;
          }
          lines.push(`read: ${value}`);
          console.log('readableStreamTest1 read', {value});
          setOutput(lines.join('\n'));
          return read();
        })
        .catch((error) => {
          lines.push('error: ' + error.message);
          console.error('readableStreamTest1 read', {error});
          setOutput(lines.join('\n'));
        });
    };

    read();
    await delay(500);
    controller.error(new Error('error'));
  };

  const readableStreamTest2 = async () => {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    let controller;

    const rs = new ReadableStream({
      async pull(c) {
        controller = c;
        await delay(250);
        c.enqueue('readable');
        await delay(250);
        c.enqueue('stream');
        await delay(250);
        c.enqueue('polyfill');
        c.close();
      },
    });

    const lines = [];
    const read = async () => {
      try {
        for await (const chunk of rs) {
          lines.push(`chunk: ${chunk}`);
          console.log('readableStreamTest2 read', {chunk});
          setOutput(lines.join('\n'));
        }
      } catch (error) {
        lines.push('error: ' + error.message);
        console.error('readableStreamTest2 read', {error});
        setOutput(lines.join('\n'));
      }
    };

    read();
    await delay(500);
    controller.error(new Error('error'));
  };

  const consoleErrorTest = () => {
    console.error('error');
    setOutput('console.error sent — check logs');
  };

  const consoleWarnTest = () => {
    console.warn('warn');
    setOutput('console.warn sent — check logs');
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <Button mode="contained" onPress={() => navigation.navigate('Id')}>
          ipfs.id()
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Ls')}>
          ipfs.ls()
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Add')}>
          ipfs.add()
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Get')}>
          ipfs.get()
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Cat')}>
          ipfs.cat()
        </Button>
        <Button mode="contained" onPress={() => navigation.navigate('Pubsub')}>
          ipfs.pubsub
        </Button>
        <Button mode="contained" onPress={runGenerator}>
          generator
        </Button>
        <Button mode="contained" onPress={runAsyncGenerator2}>
          async generator
        </Button>
        <Button mode="contained" onPress={readableStreamTest1}>
          readablestream test 1
        </Button>
        <Button mode="contained" onPress={readableStreamTest2}>
          readablestream test 2
        </Button>
        <Button mode="contained" onPress={consoleErrorTest}>
          console.error
        </Button>
        <Button mode="contained" onPress={consoleWarnTest}>
          console.warn
        </Button>
      </ScrollView>
      <ScrollView style={styles.output}>
        <Text style={styles.outputText}>{output}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  output: {flex: 1, maxHeight: 200, backgroundColor: '#f0f0f0', padding: 10},
  outputText: {fontFamily: 'monospace', fontSize: 12},
});

export default HomeScreen;
