const { promisify } = require('util');
const { logContainer } = require('../helpers');
const { docker } = require('../../config');
const ContainerLogger = require('./ContainerLogger');

class ContainerWriteLogger extends ContainerLogger {
    constructor(...args) {
        super(...args);
        this.container = docker.getContainer(this.id);
    }

    async exec() {
        const stream = await this._attachToContainer();
        this.container.modem.demuxStream(stream, this.storage, this.storage);

        stream.on('end', () => {
            this.storage.end();
            logContainer('Container finished execution', { id: this.container.id });
        });
    }

    _attachToContainer() {
        const attach = promisify(this.container.attach.bind(this.container));
        return attach({stream: true, stdout: true, stderr: true, logs: true});
    }
}

module.exports = ContainerWriteLogger;
