import React, {useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {useIpfs} from '../../ipfs-http-client';

const IdScreen = () => {
  const {client} = useIpfs();
  const [output, setOutput] = useState('');

  const id = async () => {
    try {
      setOutput('Loading...');
      const result = await client.id();
      console.log('Demo App .id', {id: result.id, publicKey: result.publicKey});
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Demo App .id', {error});
      setOutput('Error: ' + (error?.message || String(error)));
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={id}>
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

export default IdScreen;
