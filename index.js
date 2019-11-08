const dockerdListener = require('./src/engine/StartListener');
const Logger = require('./src/engine/ContainerLogger');
const createStorageLayer = require('./src/StorageLayer');
const { logContainer, normalizeId } = require('./src/helpers');
const { storageLayer } = require('./config');

dockerdListener.start(container => {
    normalizeId(container);
    logContainer('Attaching to container', container);

    const storage = createStorageLayer(storageLayer, 'writer', container);
    const logger = new Logger(container.id, storage);
    logger.run();
});
