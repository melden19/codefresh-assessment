const { Writable } = require('stream');

class WriterStream extends Writable {
    constructor({ onData, onFinish }) {
        super();
        this.on('finish', () => {
            onFinish();
        });

        this.write = onData;
    }

    _write(chunk, encoding, cb) {
        try {
            this.write(chunk.toString());
            cb();
        } catch (err) {
            cb(err)
        }
    }
}

module.exports = WriterStream;
