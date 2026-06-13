import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import {useIpfs} from '../../ipfs-http-client';

const IdScreen = () => {
  const {client} = useIpfs();

  const id = async () => {
    try {
      const result = await client.id();
      console.log('Demo App .id', {id: result.id, publicKey: result.publicKey});
    } catch (error) {
      console.error('Demo App .id', {error});
    }
  };

  return (
    <View>
      <Button mode="contained" onPress={id}>
        Press me
      </Button>
    </View>
  );
};

export default IdScreen;
