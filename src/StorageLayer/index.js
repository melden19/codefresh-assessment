const _ = require('lodash');

const layerMapper = {
  mongo: 'Mongo',
  fs:  'FS'
};

const kinds = ['writer', 'reader'];

/**
 * Storage layer factory
 * @param layer {string}
 * @param kind {string}
 * @param container {Object}
 * @returns {StorageLayer}
 */
module.exports = function (layer, kind, ...args) {
        if (!kinds.includes(kind)) {
            throw new Error('Wrong kind of storage layer, available are "writer" or "reader"');
        }

        const layerName = layerMapper[layer];
        if (!layerName) {
            console.warn('Wrong storage type, logging to stdout');
            return new require('./Base')[_.capitalize(kind)](...args);
        }

        const SpecificStorageLayer = require(`./${layerName}/${layerName}.${kind}`);
        return new SpecificStorageLayer(...args);
};
