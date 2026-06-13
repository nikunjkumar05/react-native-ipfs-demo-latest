import React, {useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {useIpfs} from '../../ipfs-http-client';

const CatScreen = () => {
  const {client} = useIpfs();
  const [output, setOutput] = useState('');

  const cat = async () => {
    const CID = 'QmPZ9gcCEpqKTo6aq61g2nXGUhM4iCL3ewB6LDXZCtioEB';

    try {
      setOutput('Loading...');
      console.log('Demo App .cat start');

      const chunks = [];
      for await (const chunk of client.cat(CID)) {
        console.log('Demo App .cat', {chunk, type: typeof chunk});
        chunks.push(chunk);
      }
      const buffer = chunks.reduce((acc, chunk) => [...acc, ...chunk], []);
      const content = new TextDecoder().decode(new Uint8Array(buffer));

      console.log('Demo App .cat', {content});
      setOutput('CID: ' + CID + '\n\nContent:\n' + content);
    } catch (error) {
      console.error('Demo App .cat', {error});
      setOutput('Error: ' + (error?.message || String(error)));
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={cat}>
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

export default CatScreen;
