import React, {useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {useIpfs} from '../../ipfs-http-client';

const AddScreen = () => {
  const {client} = useIpfs();
  const [output, setOutput] = useState('');

  const addString = async () => {
    console.log('Demo App .add string start');
    setOutput('Adding string...');
    const file = {
      path: '/tmp/rn-ipfs-add-string',
      content: 'A person from the county, surnamed Kumar. His mother once rested by the great marsh and dreamed of meeting a deity.',
    };
    try {
      const result = await client.add(file);
      console.log('Demo App .add string', {result: JSON.stringify(result, null, 2)});
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Demo App .add string error:', error?.message || String(error));
      setOutput('Error: ' + (error?.message || String(error)));
    }
  };

  const addUint8Array = async () => {
    console.log('Demo App .add Uint8Array start');
    setOutput('Adding Uint8Array...');
    const file = {
      path: '/tmp/rn-ipfs-add-uint8array',
      content: Uint8Array.from('123456789'),
    };
    try {
      const result = await client.add(file);
      console.log('Demo App .add Uint8Array', {result: JSON.stringify(result, null, 2)});
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Demo App .add Uint8Array', {error});
      setOutput('Error: ' + (error?.message || String(error)));
    }
  };

  const addUint8Arrays = async () => {
    console.log('Demo App .add Uint8Arrays start');
    setOutput('Adding Uint8Arrays...');
    const file = {
      path: '/tmp/rn-ipfs-add-uint8arrays',
      content: [
        Uint8Array.from('123456789'),
        Uint8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9]),
      ],
    };
    try {
      const result = await client.add(file);
      console.log('Demo App .add Uint8Arrays', {result: JSON.stringify(result, null, 2)});
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Demo App .add Uint8Arrays', {error});
      setOutput('Error: ' + (error?.message || String(error)));
    }
  };

  const addNumbers = async () => {
    console.log('Demo App .add numbers start');
    setOutput('Adding numbers...');
    const file = {
      path: '/tmp/rn-ipfs-add-numbers',
      content: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    };
    try {
      const result = await client.add(file);
      console.log('Demo App .add numbers', {result: JSON.stringify(result, null, 2)});
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Demo App .add numbers', {error});
      setOutput('Error: ' + (error?.message || String(error)));
    }
  };

  const addBlob = async () => {
    console.log('Demo App .add blob start');
    setOutput('Adding blob...');
    const buffer = new ArrayBuffer(9);
    const view = new Uint8Array(buffer);
    view.set([1, 2, 3, 4, 5, 6, 7, 8, 9]);

    const file = {
      path: '/tmp/rn-ipfs-add-blob',
      content: new Blob(['React Native IPFS', view.buffer]),
    };
    try {
      const result = await client.add(file);
      console.log('Demo App .add blob', {result: JSON.stringify(result, null, 2)});
      setOutput(JSON.stringify(result, null, 2));
    } catch (error) {
      console.error('Demo App .add blob', {error});
      setOutput('Error: ' + (error?.message || String(error)));
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={addString}>
        Add string
      </Button>
      <Button mode="contained" onPress={addUint8Array}>
        Add Uint8Array
      </Button>
      <Button mode="contained" onPress={addUint8Arrays}>
        Add Uint8Arrays
      </Button>
      <Button mode="contained" onPress={addNumbers}>
        Add numbers
      </Button>
      <Button mode="contained" onPress={addBlob}>
        Add blob
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

export default AddScreen;
