const fs = require('fs');

const BaseStorageLayer = require('../Base');
const { delay } = require('../../helpers');
const { fsLayerPath } = require('../constants');

class FSStorageWrite extends BaseStorageLayer.Writer {
    write(log) {
        if (!this.writeStream) {
            const writePath = `${fsLayerPath}/${this.container.id}.log`;
            if (!fs.existsSync(fsLayerPath)) {
                fs.mkdirSync(fsLayerPath, { recursive: true });
            }
            this.writeStream = fs.createWriteStream(writePath);
        }

        this.writeStream.write(log);
    }

    //
    // async init() {
    //     await delay(2000);
    // }
}

module.exports = FSStorageWrite;
