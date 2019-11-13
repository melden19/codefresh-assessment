const dockerdListener = require('./packages/server/src/engine/StartListener');
const Logger = require('./packages/server/src/engine/ContainerLogger');
const createStorageLayer = require('./packages/server/src/storageLayers');
const { logContainer, normalizeId } = require('./packages/server/src/helpers');
const { storageLayer } = require('./packages/server/config');

dockerdListener.start(container => {
    normalizeId(container);
    logContainer('Attaching to container', container);

    const storage = createStorageLayer(storageLayer, 'writer', container);
    const logger = new Logger(container.id, storage);
    logger.run();
});


// const storage = createStorageLayer(storageLayer, 'reader', { id: '8c4860eb9f5c' });
// storage.init().then(() => {
//     storage.read().then(res => {
//         console.log(res);
//         const a = process._getActiveHandles();
//         const b = process._getActiveRequests();
//         console.log(a, b);
//     });
// });
