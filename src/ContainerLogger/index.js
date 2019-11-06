const { promisify } = require('util');
const { docker } = require('../../config');
const { logContainer } = require('../helpers');
const Base = require('../StorageLayer/Base');

const defaultParameters = {
    storage: new Base.Write()
};

class ContainerLogger {
    constructor(id, options = defaultParameters) {
        this.container = docker.getContainer(id);
        this.storage = options.storageLayer;
    }

    async write() {
        try {
            await this._initWriteStorageLayer();
            const stream = await this._attachToContainer();
            this.container.modem.demuxStream(stream, this.storage, this.storage);

            stream.on('end', () => {
                this.storage.end();
                logContainer('Container finished execution', { id: this.container.id });
            });
        } catch (err) {
            console.error('Failed to log container output', err);
        }
    }

    _initWriteStorageLayer() {
        return this.storage.init(this.container.id);
    }

    _attachToContainer() {
        const attach = promisify(this.container.attach.bind(this.container));
        return attach({stream: true, stdout: true, stderr: true, logs: true});
    }
}

module.exports = ContainerLogger;
