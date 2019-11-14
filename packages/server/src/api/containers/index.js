const express = require('express');
const { checkStorageLayer } = require('../../middlewares');
const createStorageLayer = require('../../storageLayers');

const router = express.Router();

router.get('/:containerId/logs', checkStorageLayer, async (req, res, next) => {
    try {
        const storage = createStorageLayer(req.query.storageLayer, 'reader', { id: req.params.containerId });
        const data = await storage.read();
        res.json(data);
    } catch(err) {
        next(err);
    }
});

module.exports = router;
