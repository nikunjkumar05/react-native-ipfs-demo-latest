import React from 'react';
import {View} from 'react-native';
import {Button} from 'react-native-paper';
import {useIpfs} from '../../ipfs-http-client';

const GetScreen = () => {
  const {client} = useIpfs();

  const get = async () => {
    const CID = 'QmfGBRT6BbWJd7yUc2uYdaUZJBbnEFvTqehPFoSMQ6wgdr';
    try {
      console.log('Demo App .get start');

      for await (const file of client.get(CID)) {
        if (!file.content) {
          continue;
        }

        const content = [];

        for await (const chunk of file.content) {
          content.push(chunk);
        }

        console.log(
          'Demo App .get',
          JSON.stringify({file, content}, null, 2),
        );
      }
    } catch (error) {
      console.error('Demo App .get', {error});
    }
  };

  return (
    <View>
      <Button mode="contained" onPress={get}>
        Press me
      </Button>
    </View>
  );
};

export default GetScreen;
