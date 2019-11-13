const mongoose = require('mongoose');

const BaseStorageLayer = require('../Base');
const ContainerLog = require('./Log');
const { mongo, debug } = require('../../../config');
const { notFoundMessage } = require('../constants');

class MongoStorageRead extends BaseStorageLayer.Reader {
    async init() {
        if (debug) {
            return this._initMongo();
        }
    }

    async read() {
        const { id } = this.container;
        const res = await ContainerLog.findById(id);
        if (res)  {
            return res.data;
        } else {
            throw new Error(notFoundMessage);
        }
    }

    _initMongo() {
        return mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
}

module.exports = MongoStorageRead;
