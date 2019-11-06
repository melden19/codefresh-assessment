const mongoose = require('mongoose');

const BaseStorage = require('../Base');
const ContainerLog = require('./Log');
const { mongo } = require('../../../config');
const { getImageAndName } = require('../../helpers');

class MongoStorageWrite extends BaseStorage.Write {
    constructor(container) {
        super();
        this.container = container;
    }

    onFinish() {
        this.containerLog.save();
    }

    async init() {
        this.containerLog = new ContainerLog({
            _id: this.container.id,
            data: '',
            ...getImageAndName(this.container)
        });
        await this._initMongo();
    }

    writeLog(log) {
        this.containerLog.data += log;
    }

    _initMongo() {
        return mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
}

module.exports = {
    Write: MongoStorageWrite
};
