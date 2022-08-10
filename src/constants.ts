const websocketProviderOptions = {
    timeout: 10000,
    clientConfig: {
      maxReceivedFrameSize: 100000000000,
      maxReceivedMessageSize: 100000000000,
      keepalive: true,
      keepaliveInterval: 10000,
    },
    reconnect: {
      auto: true,
      delay: 10,
      maxAttempts: 10,
      onTimeout: false,
    },
  };
  
  export { websocketProviderOptions };  