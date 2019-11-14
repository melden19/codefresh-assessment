const mongoose = require('mongoose');

const BaseStorageLayer = require('../Base');
const ContainerLog = require('./Log');
const { mongo } = require('../../../config');
const { getImageAndName } = require('../../helpers');

class MongoStorageWrite extends BaseStorageLayer.Writer {
    onFinish() {
        this.containerLog.save().then(() => console.log('Saved successfully!')).catch(console.error);
    }

    async init() {
        this.containerLog = new ContainerLog({
            _id: this.container.id,
            data: '',
            ...getImageAndName(this.container)
        });

        if (mongoose.connection.readyState === 0) {
            return this._initMongo();
        }
    }

    write(log) {
        this.containerLog.data += log;
    }

    _initMongo() {
        return mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
}

module.exports = MongoStorageWrite;
