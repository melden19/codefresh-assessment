const express = require('express');
const router = express.Router();
const { availableStorageLayers } = require('../../config');
const createStorageLayer = require('../storageLayers');


router.use('/:containerId/logs', (req, res, next) => {
    const { storageLayer } = req.query;
    if (!storageLayer) {
        req.query.storageLayer = 'mongo';
    }
    if (!availableStorageLayers.includes(storageLayer)) {
        next(new Error('Storage layer is not available'));
    }
    next();
});

router.get('/:containerId/logs', async (req, res, next) => {
    try {
        const storage = createStorageLayer(req.query.storageLayer, 'reader', { id: req.params.containerId });
        const data = await storage.read();
        res.json(data);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
