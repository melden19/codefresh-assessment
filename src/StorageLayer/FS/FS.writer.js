const fs = require('fs');

const BaseStorageLayer = require('../Base');
const { delay } = require('../../helpers');

class FSStorageWrite extends BaseStorageLayer.Writer {
    write(log) {
        if (!this.writeStream) {
            this.writeStream = fs.createWriteStream(`./${this.container.id}.log`);
        }

        this.writeStream.write(log);
    }


    async init() {
        // await delay(2000);
    }
}

module.exports = FSStorageWrite;
