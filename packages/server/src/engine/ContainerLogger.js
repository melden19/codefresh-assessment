const { promisify } = require('util');
const { logContainer } = require('../helpers');
const { docker } = require('../../config');

class ContainerLogger {
    constructor(id, storage) {
        this.id = id;
        this.storage = storage;
        this.container = docker.getContainer(this.id);
    }

    async run() {
        try {
            await this._initStorageLayer();
            await this._exec();
        } catch(err) {
            console.error('Failed to run ContainerLogger', err);
        }
    }

    _initStorageLayer() {
        return this.storage.init(this.id);
    }

    async _exec() {
        const stream = await this._attachToContainer();

        stream.on('end', () => {
            this.storage.stream.end();
            logContainer('Container finished execution', { id: this.container.id });
        });

        this.container.modem.demuxStream(stream, this.storage.stream, this.storage.stream);
    }

    _attachToContainer() {
        const attach = promisify(this.container.attach.bind(this.container));
        return attach({stream: true, stdout: true, stderr: true, logs: true});
    }
}

module.exports = ContainerLogger;
