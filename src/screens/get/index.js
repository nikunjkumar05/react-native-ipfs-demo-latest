import React, {useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {useIpfs} from '../../ipfs-http-client';

const GetScreen = () => {
  const {client} = useIpfs();
  const [output, setOutput] = useState('');

  const get = async () => {
    const CID = 'QmfGBRT6BbWJd7yUc2uYdaUZJBbnEFvTqehPFoSMQ6wgdr';
    try {
      setOutput('Loading...');
      console.log('Demo App .get start');

      const results = [];
      for await (const file of client.get(CID)) {
        if (!file.content) {
          continue;
        }

        const content = [];
        for await (const chunk of file.content) {
          content.push(chunk);
        }

        results.push({path: file.path, type: file.type, content});
        console.log('Demo App .get', JSON.stringify({file, content}, null, 2));
      }

      const decoded = results.map(r => {
        const bytes = r.content.reduce((acc, chunk) => [...acc, ...chunk], []);
        const text = new TextDecoder().decode(new Uint8Array(bytes));
        return `Path: ${r.path}\nType: ${r.type}\nContent:\n${text}`;
      });

      setOutput(decoded.join('\n\n'));
    } catch (error) {
      console.error('Demo App .get', {error});
      setOutput('Error: ' + (error?.message || String(error)));
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={get}>
        Press me
      </Button>
      <ScrollView style={styles.output}>
        <Text style={styles.outputText}>{output}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  output: {flex: 1, marginTop: 10, backgroundColor: '#f0f0f0', padding: 10},
  outputText: {fontFamily: 'monospace', fontSize: 12},
});

export default GetScreen;
