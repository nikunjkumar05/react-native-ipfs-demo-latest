import React, {useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {useIpfs} from '../../ipfs-http-client';

const LsScreen = () => {
  const {client} = useIpfs();
  const [output, setOutput] = useState('');

  const ls = async () => {
    const CID = 'QmfGBRT6BbWJd7yUc2uYdaUZJBbnEFvTqehPFoSMQ6wgdr';

    try {
      setOutput('Loading...');
      console.log('Demo App .ls start');
      const entries = [];
      for await (const file of client.ls(CID)) {
        entries.push(file);
        console.log('Demo App .ls', {file: JSON.stringify(file, null, 2)});
      }
      const text = entries
        .map(e => `${e.type === 'dir' ? '[dir] ' : '      '}${e.name}  (${e.size} bytes)  ${e.cid}`)
        .join('\n');
      setOutput('CID: ' + CID + '\n\n' + (text || '(empty)'));
    } catch (error) {
      console.error('Demo App .ls', {error});
      setOutput('Error: ' + (error?.message || String(error)));
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={ls}>
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

export default LsScreen;
