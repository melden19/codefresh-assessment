const dockerdListener = require('./src/Listener');
const getLogger = require('./src/ContainerLogger');
const storageFactory = require('./src/StorageLayer/factory');
const { logContainer, normalizeId } = require('./src/helpers');
const { storageLayer } = require('./config');

const Logger = getLogger('write');

dockerdListener.start();

dockerdListener.on('container_start', container => {
    normalizeId(container);
    logContainer('Attaching to container', container);

    const storage = storageFactory(storageLayer, container);
    const logger = new Logger(container.id, storage);
    logger.run();
});
