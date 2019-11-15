import React, { useState, useCallback } from 'react'

export const Store = React.createContext();

const demoPipeline = `\
steps:
  step_1:
    image: node:10
    cmd:
      - node
      - --eval
      - "console.log('test')"
  step_2:
    image: docker/whalesay
    cmd:
      - cowsay
      - hi
`;

const AppStore = ({ children }) => {
    //  pipeline
    const pipeline = useState(demoPipeline);
    const runResponse = useState('');
    const runError = useState('');
    const runLoading = useState(false);
    const runStorageLayer = useState('mongo');

    //  logs
    const logContainerId = useState('');
    const logStorageLayer = useState('mongo');
    const logLoading = useState(false);
    const logResponse = useState('');
    const logError = useState('');

    const createStatePartition = useCallback(([value, set]) => ({ value, set }), []);

    const state = {
        pipeline: {
            editor: createStatePartition(pipeline),
            response: createStatePartition(runResponse),
            error: createStatePartition(runError),
            loading: createStatePartition(runLoading),
            storageLayer: createStatePartition(runStorageLayer),
        },
        logs: {
            container: createStatePartition(logContainerId),
            response: createStatePartition(logResponse),
            error: createStatePartition(logError),
            storageLayer: createStatePartition(logStorageLayer),
            loading: createStatePartition(logLoading),
        }
    };

    return (
        <Store.Provider value={state}>
            {children}
        </Store.Provider>
    )
}

export default AppStore;
