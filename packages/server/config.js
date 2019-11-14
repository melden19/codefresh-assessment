const _ = require('lodash');
const Docker = require('dockerode');

const debug = process.env.DEBUG === 'true';

const docker = new Docker();
const selector = {};

if (process.env.CONTAINER_LABELS) {
    const labels = process.env.CONTAINER_LABELS.split(',');
    _.set(selector, 'labels', labels);
}

_.set(selector, 'nameRegex', process.env.CONTAINER_NAME);

const mongo = {};
if (process.env.NODE_ENV === 'prod') {
    mongo.uri = process.env.MONGO_URI || 'mongodb://localhost:27017/docker-logger';
} else {
    mongo.uri = `mongodb://${debug ? 'localhost:27017' : 'mongo'}/docker-logger`
}

const containerTimeout = process.env.CONTAINER_TIMEOUT || 20000;   //  default 20 sec
const availableStorageLayers = ['fs', 'mongo'];

module.exports = {
    selector,
    docker,
    mongo,
    storageLayer: process.env.STORAGE_LAYER,
    containerTimeout,
    availableStorageLayers,
    debug
};
