const mongoose = require('mongoose');

const BaseStorageLayer = require('../Base');
const ContainerLog = require('./Log');
const { mongo } = require('../../../config');
const { getImageAndName } = require('../../helpers');

class MongoStorageWrite extends BaseStorageLayer.Writer {
    onFinish() {
        this.containerLog.save();
    }

    async init() {
        this.containerLog = new ContainerLog({
            _id: this.container.id,
            data: '',
            ...getImageAndName(this.container)
        });
        return this._initMongo();
    }

    write(log) {
        this.containerLog.data += log;
    }

    _initMongo() {
        return mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
}

module.exports = MongoStorageWrite;
