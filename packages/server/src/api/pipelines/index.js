const express = require('express');
const Engine = require('../../engine');
const { validatePipeline, checkStorageLayer } = require('../../middlewares');

const router = express.Router();

router.get('/', async (req, res) => {
    res.json({ foo: 'bar' });
});

router.post('/run', validatePipeline, checkStorageLayer, async ({ body }, res) => {
    const engine = new Engine({ pipeline: body.pipeline, storageLayer: body.storageLayer });
    const result = await engine.run();
    res.json(result);
});

module.exports = router;
