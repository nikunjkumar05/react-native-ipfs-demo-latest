import React, {createContext, useContext, useState} from 'react';
import {createIpfsClient} from './ipfs-client';

const IpfsHttpClientContext = createContext();

const Provider = ({children}) => {
  const [client] = useState(() => {
    console.log('Demo App creating raw IPFS client');
    const c = createIpfsClient();
    console.log('Demo App client created');
    return c;
  });

  return (
    <IpfsHttpClientContext.Provider value={{client}}>
      {children}
    </IpfsHttpClientContext.Provider>
  );
};

const useIpfs = () => useContext(IpfsHttpClientContext);

export {Provider, useIpfs};
