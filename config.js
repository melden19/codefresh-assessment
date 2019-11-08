const _ = require('lodash');
const Docker = require('dockerode');

const docker = new Docker();
const selector = {};

if (process.env.CONTAINER_LABELS) {
    const labels = process.env.CONTAINER_LABELS.split(',');
    _.set(selector, 'labels', labels);
}

_.set(selector, 'nameRegex', process.env.CONTAINER_NAME);

const mongo = {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/docker-logger'
};

const containerTimeout = 1000 * 60 * process.env.CONTAINER_TIMEOUT || 10;   //  default 10 min

module.exports = {
    selector,
    docker,
    mongo,
    storageLayer: process.env.STORAGE_LAYER,
    containerTimeout
};
