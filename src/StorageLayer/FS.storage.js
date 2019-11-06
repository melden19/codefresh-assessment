const fs = require('fs');

const BaseStorage = require('./Base');

class FSStorageWrite extends BaseStorage.Write {
    constructor({ id }) {
        super();
        this.id = id;
    }

    writeLog(log) {
        if (!this.writeStream) {
            this.writeStream = fs.createWriteStream(`./${this.id}.log`);
        }

        this.writeStream.write(log);
    }
}

module.exports = {
    Write: FSStorageWrite,
};
