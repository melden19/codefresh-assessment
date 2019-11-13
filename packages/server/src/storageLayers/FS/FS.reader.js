const { existsSync, readFileSync } = require('fs');
const BaseStorageLayer = require('../Base');
const { fsLayerPath, notFoundMessage } = require('../constants');

class FSStorageRead extends BaseStorageLayer.Reader {
    async read() {
        const logPath = `${fsLayerPath}/${this.container.id}.log`;
        if (existsSync(logPath)) {
            return readFileSync(logPath).toString();
        } else {
            throw new Error(notFoundMessage);
        }
    }
}

module.exports = FSStorageRead;
