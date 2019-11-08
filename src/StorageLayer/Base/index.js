const WriterStream = require('./WriterStream');

class StorageLayer {
    constructor(container) {
        this.container = container
    }

    /**
     * Will be called before writing to stream
     */
    async init() {}
}

class StorageLayerReader extends StorageLayer {
    async read() {}
}

class StorageLayerWriter extends StorageLayer {
    constructor(container) {
        super(container);
        this.stream = new WriterStream({
            onData: this.write.bind(this),
            onFinish: this.onFinish.bind(this),
        });
    }

    /**
     * Will be called every time stream receive data
     */
    write(log) {
        console.log(log);
    }

    /**
     * Will be called on stream 'finish' event
     */
    onFinish() {}
}

module.exports = {
    Writer: StorageLayerWriter,
    Reader: StorageLayerReader
};
