const { logContainer } = require('../helpers');
const ContainerLogger = require('./ContainerLogger');

class ContainerReadLogger extends ContainerLogger {
    constructor(id, storageLayer) {
        super(storageLayer);
    }

    async exec() {
        console.log('reading logs...')
    }
}

module.exports = ContainerReadLogger;
