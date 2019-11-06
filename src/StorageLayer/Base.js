const { Duplex, Writable } = require('stream');

class BaseStorageLayerWrite extends Writable {
    constructor() {
        super();
        this.on('finish', () => {
            this.onFinish();
        });
    }

    onFinish() {}
    init() {}
    writeLog(log) {
        console.log(log);
    }

    _write(chunk, encoding, cb) {
        try {
            this.writeLog(chunk.toString());
            cb();
        } catch (err) {
            cb(err)
        }
    }
}

class BaseStorageLayerRead {

}

module.exports = {
    Write: BaseStorageLayerWrite,
    Read: BaseStorageLayerRead
};
