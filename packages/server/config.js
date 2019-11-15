const Docker = require('dockerode');

const debug = process.env.DEBUG === 'true';

const docker = new Docker();

const mongo = {};

mongo.uri = process.env.MONGO_URI || 'mongodb://mongo/docker-logger';

const containerTimeout = process.env.CONTAINER_TIMEOUT || 20000;   //  default 20 sec
const availableStorageLayers = ['fs', 'mongo'];

module.exports = {
    docker,
    mongo,
    containerTimeout,
    availableStorageLayers,
    debug
};
