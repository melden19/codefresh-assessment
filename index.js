const dockerdListener = require('./src/Listener');
const ContainerLogger = require('./src/ContainerLogger');
const storageFactory = require('./src/StorageLayer/factory');
const { logContainer, normalizeId } = require('./src/helpers');

dockerdListener.start();

dockerdListener.on('container_start', container => {
    normalizeId(container);
    logContainer('Attaching to container', container);

    const storageLayer = storageFactory('mongo', container);
    const logger = new ContainerLogger(container.id, {
        storageLayer
    });
    logger.write();
});
//
// const storageLayer = storageFactory('mongo');
// const logger = new ContainerLogger('3dff88bba9dbdd8', {
//     storageLayer
// });
