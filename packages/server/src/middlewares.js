const { availableStorageLayers } = require('../config');
const yaml = require('js-yaml');

module.exports.checkStorageLayer = (req, res, next) => {
    const storageLayerHolder = req.method === 'GET' ? 'query' : 'body';

    const { storageLayer } = req[storageLayerHolder];
    if (!storageLayer) {
        req[storageLayerHolder].storageLayer = 'mongo';
    }
    if (!availableStorageLayers.includes(storageLayer)) {
        next(new Error('Storage layer is not available'));
    }
    next();

};

module.exports.validatePipeline = (req, res, next) => {
    if (req.body.pipeline) {
        const decodedPipeline = Buffer.from(req.body.pipeline, 'base64').toString();
        try {
            req.body.pipeline = yaml.safeLoad(decodedPipeline);
            next();
        } catch(err) {
            next(err);
        }
    } else {
        next(new Error('Please, provide pipeline'));
    }
};