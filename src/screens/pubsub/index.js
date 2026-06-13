import React, {useState} from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {multiaddr} from '@multiformats/multiaddr';
import {useIpfs} from '../../ipfs-http-client';

const TOPIC = 'react-native-ipfs-demo';
const ADDR = multiaddr(
  '/ip4/147.75.100.9/tcp/4001/p2p/Qmbut9Ywz9YEDrz8ySBSgWyJk41Uvm2QJPhwDJzJyGFsD6',
);

const PubsubScreen = () => {
  const {
    client: {pubsub, swarm},
  } = useIpfs();
  const [output, setOutput] = useState('');

  const connect = async () => {
    try {
      setOutput('Connecting...');
      console.log('Demo App .pubsub start');
      await swarm.connect(ADDR);
      console.log('Demo App .pubsub connect', {addr: ADDR});
      setOutput('Connected to:\n' + ADDR.toString());
    } catch (error) {
      console.error('Demo App .pubsub connect', {addr: ADDR, error});
      setOutput('Connect error: ' + (error?.message || String(error)));
    }
  };

  const disconnect = async () => {
    try {
      setOutput('Disconnecting...');
      console.log('Demo App .disconnect start');
      await swarm.disconnect(ADDR);
      console.log('Demo App .pubsub disconnect', {addr: ADDR});
      setOutput('Disconnected from:\n' + ADDR.toString());
    } catch (error) {
      console.error('Demo App .pubsub disconnect', {addr: ADDR, error});
      setOutput('Disconnect error: ' + (error?.message || String(error)));
    }
  };

  const subscribe = async () => {
    try {
      setOutput('Subscribing...');
      console.log('Demo App .pubsub subscribe start');
      await pubsub.subscribe(TOPIC, (msg) => {
        const text = new TextDecoder().decode(msg.data);
        setOutput(prev => prev + '\n\nMessage received:\n' + text);
        console.log('Demo app .pubsub message', {msg});
      }, {
        onError: (error) => {
          setOutput(prev => prev + '\n\nSubscribe error:\n' + (error?.message || String(error)));
          console.log('Demo app .pubsub error', {error});
        },
      });
      console.log('Demo App .pubsub subscribe', {topic: TOPIC});
      setOutput('Subscribed to topic:\n' + TOPIC);
    } catch (error) {
      console.error('Demo App .pubsub subscribe', {topic: TOPIC, error});
      setOutput('Subscribe error: ' + (error?.message || String(error)));
    }
  };

  const unsubscribe = async () => {
    try {
      setOutput('Unsubscribing...');
      console.log('Demo App .pubsub unsubscribe start');
      await pubsub.unsubscribe(TOPIC);
      console.log('Demo App .pubsub unsubscribe', {topic: TOPIC});
      setOutput('Unsubscribed from topic:\n' + TOPIC);
    } catch (error) {
      console.error('Demo App .pubsub unsubscribe', {topic: TOPIC, error});
      setOutput('Unsubscribe error: ' + (error?.message || String(error)));
    }
  };

  const publish = async () => {
    try {
      setOutput('Publishing...');
      console.log('Demo App .pubsub publish start');
      const msg = new TextEncoder().encode('hello');
      await pubsub.publish(TOPIC, msg);
      console.log('Demo App .pubsub publish', {topic: TOPIC, msg});
      setOutput('Published to topic:\n' + TOPIC + '\nMessage: hello');
    } catch (error) {
      console.error('Demo App .pubsub publish', {error});
      setOutput('Publish error: ' + (error?.message || String(error)));
    }
  };

  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={connect}>
        Connect
      </Button>
      <Button mode="contained" onPress={disconnect}>
        Disconnect
      </Button>
      <Button mode="contained" onPress={subscribe}>
        Subscribe
      </Button>
      <Button mode="contained" onPress={unsubscribe}>
        Unsubscribe
      </Button>
      <Button mode="contained" onPress={publish}>
        Publish
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

export default PubsubScreen;
