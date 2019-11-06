const FSStorage = require('./FS.storage');
const MongoStorage = require('./Mongo.storage');
const Base = require('./Base.js');

module.exports = function (layer, ...args) {
    switch(layer) {
        case 'fs': return new FSStorage.Write(...args);
        case 'mongo': return new MongoStorage.Write(...args);
        default: {
            console.warn('Wrong storage type, logging to stdout');
            return new Base.Write();
        }
    }
};
